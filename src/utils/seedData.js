import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { dummyProblems, dummySolutions } from '../data/dummyData';

export const seedDatabase = async () => {
    try {
        console.log("Starting seed process...");

        // 1. Check if data already exists to avoid massive duplication
        const problemsCheck = await getDocs(query(collection(db, 'problems'), limit(1)));
        if (!problemsCheck.empty) {
            const proceed = window.confirm("Database already contains data. Seeding again will create duplicates. Continue?");
            if (!proceed) return "Cancelled";
        }

        // 2. Add Problems
        const problemIds = {};
        for (const p of dummyProblems) {
            const docRef = await addDoc(collection(db, 'problems'), {
                title: p.title,
                summary: p.summary,
                author: p.author,
                authorId: "system_demo_user", // Placeholder
                role: p.role,
                tags: p.tags,
                category: p.category,
                engagement: {
                    likes: p.engagement.likes,
                    comments: p.engagement.comments
                },
                createdAt: serverTimestamp()
            });
            problemIds[p.id] = docRef.id;
        }
        console.log("Problems seeded.");

        // 3. Add Solutions
        for (const s of dummySolutions) {
            const problemId = problemIds[s.linkedTo?.id] || null;
            await addDoc(collection(db, 'solutions'), {
                title: s.title,
                summary: s.summary,
                author: s.author,
                authorId: "system_demo_user",
                role: s.role,
                tags: s.tags,
                category: s.category,
                engagement: {
                    likes: s.engagement.likes,
                    comments: s.engagement.comments
                },
                linkedTo: s.linkedTo ? {
                    id: problemId,
                    title: s.linkedTo.title,
                    type: 'Problem'
                } : null,
                createdAt: serverTimestamp()
            });
        }
        console.log("Solutions seeded.");

        // 4. Add some Ideas (Derived from solutions or new)
        const dummyIdeas = [
            {
                title: "Decentralized Carbon Credits",
                summary: "A blockchain-based platform for small businesses to trade verified carbon offsets with zero transaction fees.",
                author: "EcoVanguard",
                tags: ["#Web3", "#Climate"],
                category: "Environment"
            },
            {
                title: "Modular Urban Vertical Farms",
                summary: "Pre-fabricated hydroponic units that can be installed on apartment balconies to provide fresh greens for city dwellers.",
                author: "UrbanGreen",
                tags: ["#AgriTech", "#Sustainability"],
                category: "Agriculture"
            }
        ];

        for (const i of dummyIdeas) {
            await addDoc(collection(db, 'ideas'), {
                ...i,
                authorId: "system_demo_user",
                role: "Innovator",
                engagement: { likes: 45, comments: 12 },
                createdAt: serverTimestamp()
            });
        }
        console.log("Ideas seeded.");

        return "Success";
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};
