require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();

// ✅ Proper CORS setup to allow frontend access
const corsOptions = {
    origin: ["https://seekerofpower.com", "https://www.seekerofpower.com"], // ✅ Allow both versions
    methods: "POST, GET, OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true 
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

// ✅ Fix PORT issue - Declare only ONCE
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
