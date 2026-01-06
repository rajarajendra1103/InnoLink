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

const problems = [
    {
        title: "Urban Air Quality in Emerging Cities",
        summary: "Rapid urbanization is leading to dangerous levels of PM2.5 in cities across Southeast Asia. Monitoring is sparse and intervention is slow.",
        author: "Sarah Chen",
        authorId: "user_1",
        role: "Environmental Engineer",
        tags: ["#Sustainability", "#UrbanPlanning", "#Pollution"],
        engagement: { likes: 12, comments: 4 }
    },
    {
        title: "Inefficient E-waste Management",
        summary: "Millions of tons of electronic waste are discarded annually without proper recycling, leaking heavy metals into the soil.",
        author: "Raj Patel",
        authorId: "user_2",
        role: "Hardware Dev",
        tags: ["#Ewaste", "#Recycling", "#Environment"],
        engagement: { likes: 8, comments: 2 }
    },
    {
        title: "Mental Health Access in Rural Areas",
        summary: "Isolated communities lack access to professional therapy services, leading to untreated anxiety and depression.",
        author: "Emma Wilson",
        authorId: "user_3",
        role: "Social Worker",
        tags: ["#Healthcare", "#MentalHealth", "#Rural"],
        engagement: { likes: 5, comments: 1 }
    },
    {
        title: "Retail Food Waste Paradox",
        summary: "Supermarkets throw away tons of near-expiry food while local food banks struggle to meet demand.",
        author: "Michael Brown",
        authorId: "user_4",
        role: "Logistics Expert",
        tags: ["#FoodWaste", "#SupplyChain", "#SocialImpact"],
        engagement: { likes: 20, comments: 7 }
    },
    {
        title: "Ocean Microplastics Contamination",
        summary: "Microplastics have entered the human food chain through seafood. We need better detection and filtration methods.",
        author: "Dr. Alicia Torres",
        authorId: "user_5",
        role: "Marine Biologist",
        tags: ["#Ocean", "#PlasticFree", "#Health"],
        engagement: { likes: 45, comments: 12 }
    },
    {
        title: "Slow Adoption of Renewable Energy in Apartments",
        summary: "Apartment dwellers have no easy way to participate in solar energy generation due to roof ownership conflicts.",
        author: "Kevin Zhang",
        authorId: "user_6",
        role: "Urban Resident",
        tags: ["#Solar", "#Energy", "#UrbanLiving"],
        engagement: { likes: 15, comments: 3 }
    },
    {
        title: "Technical Debt in Rapidly Scaling Startups",
        summary: "Startups often sacrifice code quality for speed, leading to systems that are nearly impossible to maintain after 2 years.",
        author: "Alex Rivera",
        authorId: "user_7",
        role: "CTO",
        tags: ["#SoftwareDev", "#Startups", "#TechDebt"],
        engagement: { likes: 33, comments: 9 }
    }
];

const ideas = [
    {
        title: "AI-Powered Personal Learning Path",
        summary: "An adaptive learning platform that generates custom curriculums based on a student's interests and learning pace using LLMs.",
        author: "Julia Smith",
        authorId: "user_8",
        role: "EdTech Enthusiast",
        tags: ["#AI", "#Education", "#Learning"],
        engagement: { likes: 18, comments: 5 }
    },
    {
        title: "Decentralized Peer-to-Peer Energy Grid",
        summary: "Using blockchain to allow neighbors to sell excess solar energy to each other without a central utility provider.",
        author: "David Lee",
        authorId: "user_9",
        role: "Blockchain Dev",
        tags: ["#Web3", "#Energy", "#Solar"],
        engagement: { likes: 27, comments: 3 }
    },
    {
        title: "Vertical Farming in Repurposed Shipping Containers",
        summary: "Modular hydroponic units that can be deployed in urban food deserts to provide fresh produce locally.",
        author: "Sophia Garcia",
        authorId: "user_10",
        role: "Urban Farmer",
        tags: ["#AgTech", "#UrbanFarming", "#Sustainability"],
        engagement: { likes: 42, comments: 8 }
    },
    {
        title: "Gamified Fitness for Remote Teams",
        summary: "A Slack integration that creates team-based fitness challenges to boost morale and physical health for WFH employees.",
        author: "Chris Evans",
        authorId: "user_11",
        role: "HR Manager",
        tags: ["#RemoteWork", "#Fitness", "#TeamBuilding"],
        engagement: { likes: 11, comments: 2 }
    },
    {
        title: "Privacy-Preserving Contact Tracing",
        summary: "A zero-knowledge proof system for health verification without revealing personal identity or location history.",
        author: "Nora Quinn",
        authorId: "user_12",
        role: "Cypherpunk",
        tags: ["#Privacy", "#Security", "#Tech"],
        engagement: { likes: 9, comments: 1 }
    },
    {
        title: "Modular Smartphone Hardware",
        summary: "A phone design where users can easily swap out the camera, battery, or screen to reduce electronic waste.",
        author: "Leo Kim",
        authorId: "user_13",
        role: "Product Designer",
        tags: ["#Hardware", "#Sustainability", "#Design"],
        engagement: { likes: 55, comments: 15 }
    },
    {
        title: "Crowdsourced Disaster Response Mapping",
        summary: "Real-time mapping platform that uses social media feeds and AI to identify urgent needs during natural disasters.",
        author: "Hannah Abbott",
        authorId: "user_14",
        role: "Data Scientist",
        tags: ["#AI", "#DisasterRelief", "#OpenData"],
        engagement: { likes: 22, comments: 4 }
    }
];

const solutions = [
    {
        title: "BreatheClean: Bus-Mounted Air Filters",
        summary: "A filtration system installed on city buses that cleans the air as they drive through high-pollution corridors.",
        author: "EcoVentures Inc.",
        authorId: "org_1",
        role: "Green Tech Startup",
        tags: ["#CleanAir", "#UrbanTech", "#Innovation"],
        engagement: { likes: 67, comments: 11 }
    },
    {
        title: "MindLink P2P Support App",
        summary: "Connecting rural residents with trained peer supporters using high-compression video tech for low-bandwidth areas.",
        author: "HealthConnect",
        authorId: "org_2",
        role: "Non-Profit",
        tags: ["#Healthcare", "#Accessibility", "#App"],
        engagement: { likes: 38, comments: 6 }
    },
    {
        title: "CleanSweep Ocean Drones",
        summary: "Autonomous solar-powered drones that skim the ocean surface for plastic debris and micro-plastics.",
        author: "BlueHorizon",
        authorId: "org_3",
        role: "Robotics Laboratory",
        tags: ["#OceanCleanup", "#Robotics", "#Automation"],
        engagement: { likes: 112, comments: 25 }
    },
    {
        title: "SunShare Platform",
        summary: "A legal and technical framework for shared solar ownership in multi-unit residential buildings.",
        author: "VoltGrid",
        authorId: "org_4",
        role: "Energy Startup",
        tags: ["#Solar", "#PropTech", "#Energy"],
        engagement: { likes: 24, comments: 5 }
    },
    {
        title: "DevAudit: Technical Debt Analyzer",
        summary: "A tool that quantifies technical debt in codebase and suggests prioritized refactoring tasks for management.",
        author: "RefactorAI",
        authorId: "org_5",
        role: "Developer Tools",
        tags: ["#DevTools", "#AI", "#Management"],
        engagement: { likes: 49, comments: 14 }
    },
    {
        title: "FoodFlow: Retail to Pantry Link",
        summary: "Automated logistics system that notifies local pantries of available surplus food for immediate pickup.",
        author: "ZeroWaste",
        authorId: "org_6",
        role: "Social Enterprise",
        tags: ["#FoodSecurity", "#Logistics", "#Efficiency"],
        engagement: { likes: 88, comments: 19 }
    }
];

async function seed() {
    console.log("Starting seed...");

    for (const prob of problems) {
        await addDoc(collection(db, "problems"), {
            ...prob,
            createdAt: serverTimestamp()
        });
        console.log(`Added problem: ${prob.title}`);
    }

    for (const idea of ideas) {
        await addDoc(collection(db, "ideas"), {
            ...idea,
            createdAt: serverTimestamp()
        });
        console.log(`Added idea: ${idea.title}`);
    }

    for (const sol of solutions) {
        await addDoc(collection(db, "solutions"), {
            ...sol,
            createdAt: serverTimestamp()
        });
        console.log(`Added solution: ${sol.title}`);
    }

    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error("Error seeding data:", err);
    process.exit(1);
});
