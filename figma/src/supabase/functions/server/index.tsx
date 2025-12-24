import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const getServiceClient = () => createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const getAnonClient = () => createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0ae5d492/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ROUTES =============

// Sign up new user
app.post("/make-server-0ae5d492/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName, phone, district } = body;

    if (!email || !password || !fullName || !phone || !district) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const supabase = getServiceClient();
    
    // Check if user already exists by trying to find them
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.find(u => u.email === email);
    
    if (userExists) {
      console.log(`Signup error: User with email ${email} already exists`);
      return c.json({ error: 'An account with this email already exists. Please login instead.' }, 400);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        phone,
        district 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      // Provide better error messages
      if (error.message.includes('already registered') || error.message.includes('duplicate')) {
        return c.json({ error: 'An account with this email already exists. Please login instead.' }, 400);
      }
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      fullName,
      phone,
      district,
      createdAt: new Date().toISOString(),
      parcelCount: 0,
      rewards: 0
    });

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email,
        fullName,
        phone,
        district
      }
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Sign in user
app.post("/make-server-0ae5d492/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const supabase = getAnonClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Signin error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || '',
        phone: data.user.user_metadata?.phone || '',
        district: data.user.user_metadata?.district || ''
      }
    });
  } catch (error) {
    console.log(`Signin error: ${error}`);
    return c.json({ error: 'Signin failed' }, 500);
  }
});

// Get current session
app.get("/make-server-0ae5d492/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`);

    return c.json({ 
      success: true,
      user: userData || {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        district: user.user_metadata?.district || ''
      }
    });
  } catch (error) {
    console.log(`Session check error: ${error}`);
    return c.json({ error: 'Session check failed' }, 500);
  }
});

// Sign out user
app.post("/make-server-0ae5d492/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const supabase = getServiceClient();
    await supabase.auth.admin.signOut(accessToken);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Signout error: ${error}`);
    return c.json({ error: 'Signout failed' }, 500);
  }
});

// ============= PARCEL ROUTES =============

// Create new parcel
app.post("/make-server-0ae5d492/parcels", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const parcelData = body;

    // Generate tracking number in format FWEN 2345TR
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4 digit number
    const randomLetters = Math.random().toString(36).substr(2, 2).toUpperCase(); // 2 letters
    const trackingNumber = `FWEN ${randomNum}${randomLetters}`;

    // Create parcel record
    const parcel = {
      trackingNumber,
      userId: user.id,
      ...parcelData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          location: parcelData.senderDistrict,
          description: 'Parcel booking confirmed'
        }
      ]
    };

    await kv.set(`parcel:${trackingNumber}`, parcel);
    
    // Add to user's parcels list
    const userParcelsKey = `user:${user.id}:parcels`;
    const existingParcels = await kv.get(userParcelsKey) || [];
    await kv.set(userParcelsKey, [...existingParcels, trackingNumber]);

    // Update user parcel count
    const userData = await kv.get(`user:${user.id}`);
    if (userData) {
      userData.parcelCount = (userData.parcelCount || 0) + 1;
      userData.rewards = (userData.rewards || 0) + Math.floor(parcelData.cost / 1000);
      await kv.set(`user:${user.id}`, userData);
    }

    return c.json({ 
      success: true,
      trackingNumber,
      parcel
    });
  } catch (error) {
    console.log(`Create parcel error: ${error}`);
    return c.json({ error: 'Failed to create parcel' }, 500);
  }
});

// Get parcel by tracking number
app.get("/make-server-0ae5d492/parcels/:trackingNumber", async (c) => {
  try {
    const trackingNumber = c.req.param('trackingNumber');
    
    const parcel = await kv.get(`parcel:${trackingNumber}`);

    if (!parcel) {
      return c.json({ error: 'Parcel not found' }, 404);
    }

    return c.json({ success: true, parcel });
  } catch (error) {
    console.log(`Get parcel error: ${error}`);
    return c.json({ error: 'Failed to get parcel' }, 500);
  }
});

// Update parcel status
app.put("/make-server-0ae5d492/parcels/:trackingNumber/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const trackingNumber = c.req.param('trackingNumber');
    const body = await c.req.json();
    const { status, location, description } = body;

    const parcel = await kv.get(`parcel:${trackingNumber}`);

    if (!parcel) {
      return c.json({ error: 'Parcel not found' }, 404);
    }

    // Update status
    parcel.status = status;
    parcel.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      location,
      description
    });

    await kv.set(`parcel:${trackingNumber}`, parcel);

    return c.json({ success: true, parcel });
  } catch (error) {
    console.log(`Update parcel status error: ${error}`);
    return c.json({ error: 'Failed to update parcel status' }, 500);
  }
});

// Get user's parcels
app.get("/make-server-0ae5d492/user/parcels", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userParcelsKey = `user:${user.id}:parcels`;
    const trackingNumbers = await kv.get(userParcelsKey) || [];

    const parcels = [];
    for (const trackingNumber of trackingNumbers) {
      const parcel = await kv.get(`parcel:${trackingNumber}`);
      if (parcel) {
        parcels.push(parcel);
      }
    }

    // Sort by creation date (newest first)
    parcels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, parcels });
  } catch (error) {
    console.log(`Get user parcels error: ${error}`);
    return c.json({ error: 'Failed to get user parcels' }, 500);
  }
});

// ============= PROFILE ROUTES =============

// Get user profile
app.get("/make-server-0ae5d492/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ success: true, profile: userData });
  } catch (error) {
    console.log(`Get user profile error: ${error}`);
    return c.json({ error: 'Failed to get user profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-0ae5d492/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const userData = await kv.get(`user:${user.id}`);

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Update user data
    const updatedUser = {
      ...userData,
      ...body,
      id: user.id, // Preserve user ID
      email: userData.email, // Preserve email
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedUser);

    return c.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.log(`Update user profile error: ${error}`);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// ============= UTILITY ROUTES =============

// Initialize demo account
app.post("/make-server-0ae5d492/init-demo", async (c) => {
  try {
    const supabase = getServiceClient();
    
    // Check if demo user already exists
    const demoEmail = 'demo@fwen.ug';
    const demoPassword = 'demo123';
    
    try {
      // Try to sign in first to see if user exists
      const anonClient = getAnonClient();
      const { data: signInData } = await anonClient.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });
      
      if (signInData?.user) {
        return c.json({ success: true, message: 'Demo account already exists' });
      }
    } catch (e) {
      // User doesn't exist, create it
    }
    
    // Create demo user
    const { data, error } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      user_metadata: { 
        full_name: 'Demo User',
        phone: '0700000000',
        district: 'Kampala'
      },
      email_confirm: true
    });

    if (error) {
      console.log(`Demo account creation error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store demo user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: demoEmail,
      fullName: 'Demo User',
      phone: '0700000000',
      district: 'Kampala',
      createdAt: new Date().toISOString(),
      parcelCount: 3,
      rewards: 50
    });

    // Create some demo parcels
    const demoParcels = [
      {
        trackingNumber: 'FWEN 1234AB',
        userId: data.user.id,
        senderName: 'Demo User',
        senderPhone: '0700000000',
        senderDistrict: 'Kampala',
        receiverName: 'Jane Doe',
        receiverPhone: '0701234567',
        receiverDistrict: 'Masaka',
        parcelType: 'documents',
        weight: 2,
        cost: 15000,
        status: 'delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          { status: 'pending', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), location: 'Kampala', description: 'Parcel booking confirmed' },
          { status: 'collected', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), location: 'Kampala', description: 'Parcel collected from sender' },
          { status: 'in_transit', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'En route to Masaka', description: 'Parcel on the bus' },
          { status: 'delivered', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), location: 'Masaka', description: 'Delivered successfully' }
        ]
      },
      {
        trackingNumber: 'FWEN 5678CD',
        userId: data.user.id,
        senderName: 'Demo User',
        senderPhone: '0700000000',
        senderDistrict: 'Kampala',
        receiverName: 'John Smith',
        receiverPhone: '0707654321',
        receiverDistrict: 'Mbarara',
        parcelType: 'package',
        weight: 5,
        cost: 25000,
        status: 'in_transit',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          { status: 'pending', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'Kampala', description: 'Parcel booking confirmed' },
          { status: 'collected', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), location: 'Kampala', description: 'Parcel collected from sender' },
          { status: 'in_transit', timestamp: new Date().toISOString(), location: 'En route to Mbarara', description: 'Parcel on the bus' }
        ]
      },
      {
        trackingNumber: 'FWEN 9012EF',
        userId: data.user.id,
        senderName: 'Demo User',
        senderPhone: '0700000000',
        senderDistrict: 'Kampala',
        receiverName: 'Alice Johnson',
        receiverPhone: '0703456789',
        receiverDistrict: 'Gulu',
        parcelType: 'electronics',
        weight: 3,
        cost: 35000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'pending', timestamp: new Date().toISOString(), location: 'Kampala', description: 'Parcel booking confirmed' }
        ]
      }
    ];

    // Store demo parcels
    for (const parcel of demoParcels) {
      await kv.set(`parcel:${parcel.trackingNumber}`, parcel);
    }

    // Add parcels to user's list
    await kv.set(`user:${data.user.id}:parcels`, demoParcels.map(p => p.trackingNumber));

    return c.json({ 
      success: true, 
      message: 'Demo account created successfully',
      email: demoEmail,
      password: demoPassword
    });
  } catch (error) {
    console.log(`Init demo error: ${error}`);
    return c.json({ error: 'Failed to initialize demo account' }, 500);
  }
});

// ============= CARGO DASHBOARD ROUTES =============

// Get cargo dashboard stats
app.get("/make-server-0ae5d492/cargo/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userParcelsKey = `user:${user.id}:parcels`;
    const trackingNumbers = await kv.get(userParcelsKey) || [];

    const parcels = [];
    for (const trackingNumber of trackingNumbers) {
      const parcel = await kv.get(`parcel:${trackingNumber}`);
      if (parcel) {
        parcels.push(parcel);
      }
    }

    // Calculate stats
    const totalParcels = parcels.length;
    const deliveredParcels = parcels.filter(p => p.status === 'delivered').length;
    const inTransitParcels = parcels.filter(p => ['in_transit', 'dispatched', 'collected'].includes(p.status)).length;
    const pendingParcels = parcels.filter(p => p.status === 'pending').length;
    const totalRevenue = parcels.reduce((sum, p) => sum + (p.cost || 0), 0);

    return c.json({ 
      success: true, 
      stats: {
        totalParcels,
        deliveredParcels,
        inTransitParcels,
        pendingParcels,
        totalRevenue,
        parcels: parcels.slice(0, 10) // Return latest 10 parcels
      }
    });
  } catch (error) {
    console.log(`Get cargo stats error: ${error}`);
    return c.json({ error: 'Failed to get cargo stats' }, 500);
  }
});

Deno.serve(app.fetch);
