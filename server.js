require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();

// ✅ Fix CORS issue to allow requests from frontend
const corsOptions = {
    origin: "https://www.seekerofpower.com", // Allow only your frontend
    methods: "POST, GET, OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Crossroads Soul Selling Guide"
                    },
                    unit_amount: 666
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "https://www.seekerofpower.com/success.html",
            cancel_url: "https://www.seekerofpower.com/"
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ Ensure Render assigns the correct port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
