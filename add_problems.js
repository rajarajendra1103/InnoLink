import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXop9qsfdduX-0nMbQPOe4NhGMsdZEKJE",
    authDomain: "innolink-db320.firebaseapp.com",
    projectId: "innolink-db320",
    storageBucket: "innolink-db320.firebasestorage.app",
    messagingSenderId: "1002307153142",
    appId: "1:1002307153142:web:98ee9851c6b3ff387e50d7",
    measurementId: "G-6S4Z9XLX6N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newProblems = [
    {
        title: "Clean Water Access in Arid Zones",
        summary: "Many rural communities in drought-prone areas lack the infrastructure for consistent clean water, leading to health crises and agricultural failure.",
        author: "Dr. Elena Rossi",
        authorId: "user_p101",
        role: "Hydrologist",
        tags: ["#WaterCrisis", "#Sustainability", "#Health"],
        engagement: { likes: 14, comments: 3 }
    },
    {
        title: "Vocational Training Financial Gap",
        summary: "Students in technical fields often drop out due to high material costs and lack of short-term financial support during internships.",
        author: "Marcus Thorne",
        authorId: "user_p102",
        role: "Education Consultant",
        tags: ["#Education", "#Vocational", "#FinTech"],
        engagement: { likes: 9, comments: 5 }
    },
    {
        title: "SME Cybersecurity Fragility",
        summary: "Small and medium enterprises in rural hubs are increasingly targeted by ransomware but lack the budget for high-end security teams.",
        author: "Sarah Jenkins",
        authorId: "user_p103",
        role: "Cyber Analyst",
        tags: ["#Security", "#Business", "#Tech"],
        engagement: { likes: 25, comments: 8 }
    },
    {
        title: "Medical Single-Use Plastic Waste",
        summary: "The healthcare sector generates massive amounts of non-recyclable plastic waste. We need sterile yet biodegradable alternatives.",
        author: "Dr. Amit Varma",
        authorId: "user_p104",
        role: "Hospital Admin",
        tags: ["#Medical", "#GreenHealth", "#Pollution"],
        engagement: { likes: 31, comments: 12 }
    },
    {
        title: "Urban Transit Inefficiency",
        summary: "Public transport in expanding cities often relies on outdated routes that don't reflect current population shifts, leading to long commutes.",
        author: "Jordan Smith",
        authorId: "user_p105",
        role: "Urban Planner",
        tags: ["#UrbanTransit", "#SmartCity", "#Infrastructure"],
        engagement: { likes: 18, comments: 4 }
    }
];

async function addProblems() {
    console.log("Adding 5 new problems...");

    for (const prob of newProblems) {
        await addDoc(collection(db, "problems"), {
            ...prob,
            createdAt: serverTimestamp()
        });
        console.log(`Added problem: ${prob.title}`);
    }

    console.log("Successfully added 5 problems!");
    process.exit(0);
}

addProblems().catch(err => {
    console.error("Error adding problems:", err);
    process.exit(1);
});
