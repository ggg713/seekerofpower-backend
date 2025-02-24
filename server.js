require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();

// ✅ Fix CORS issue
const corsOptions = {
    origin: "https://www.seekerofpower.com",
    methods: "POST, GET, OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: "Crossroads Soul Selling Guide" },
                    unit_amount: 666
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "https://www.seekerofpower.com/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://www.seekerofpower.com/"
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Verify Payment (Prevents Free Access)
app.get("/verify-payment", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        if (session.payment_status === "paid") {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Backend Status Check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ Dynamic Port (For Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
