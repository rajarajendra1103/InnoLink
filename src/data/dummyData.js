export const dummyProblems = [
    {
        id: 'p1', type: 'Problem', author: 'Sarah Jenkins', role: 'Hackathon Organizer', time: '2h ago',
        title: 'Excessive Plastic Waste in Urban Waterways',
        summary: 'The urban waterways in our city are facing a catastrophic crisis due to the unchecked accumulation of plastic waste, ranging from micro-plastics less than 5mm in diameter to massive macro-plastics like discarded consumer goods and industrial packaging. Recent environmental surveys estimate that over 15 tons of waste enter the river system daily, completely bypassing existing filtration barriers which were designed decades ago primarily for organic debris like branches and leaves. This pollution has decimated local aquatic life, with native fish populations dropping by 40% in the last five years, and has created a severe public health hazard as micro-plastics enter the downstream water supply used by over 200,000 residents. Current solutions such as manual dredging are prohibitively expensive, dangerous for workers, and ineffective at scale, covering less than 5% of the required area. We urgently need a scalable, automated, and low-maintenance filtration or skimming approach. The ideal solution must be capable of operating off-grid, perhaps harnessing river currents or solar energy, and must be robust enough to withstand seasonal flood surges without requiring constant repair. Furthermore, the unit cost must be kept under $5,000 to allow for wide-scale deployment by municipal authorities who are currently budget-constrained. We can provide access to three pilot sites along the river for testing prototypes and have historical data on flow rates and waste composition available for analysis.',
        tags: ['#Environment', '#Sustainability'], engagement: { likes: 124, comments: 45 }, category: 'Environment', linkedCount: 3
    },
    {
        id: 'p2', type: 'Problem', author: 'City Hospital', role: 'Institution', time: '1d ago',
        title: 'Patient Queue Management in Emergency',
        summary: 'Our Emergency Room (ER) faces a critical bottleneck during peak hours, particularly during flu seasons or weekends, where patient wait times can unpredictably spike to over four hours. This delay not only leads to patient dissatisfaction and increased suffering but can be life-threatening for cases that are incorrectly triaged as low-priority. The core issue is the manual and linear nature of our intake process, which relies heavily on a limited number of triage nurses to assess every walk-in. We are seeking an AI-driven predictive model or a digital intake interface that can gather preliminary patient vitals and symptoms before they even reach the nurse. This system should analyze historical admission data, current waiting room capacity, and incoming ambulance traffic to dynamically predict wait times and suggest optimal resource allocation (e.g., shifting nurses from other wards). It must be HIPAA-compliant, user-friendly for non-tech-savvy patients (possibly voice-activated), and capable of flagging high-risk keywords (like "chest pain" or "numbness") to immediately alert staff. A reduction in average wait time by even 20% would significantly improve our standard of care.',
        tags: ['#Healthcare', '#AI'], engagement: { likes: 67, comments: 23 }, category: 'Health', linkedCount: 1
    },
    {
        id: 'p3', type: 'Problem', author: 'AgriCorp', role: 'Company', time: '3d ago',
        title: 'Crop Disease Detection for Rural Farmers',
        summary: 'Smallholder farmers in remote rural regions are losing up to 40% of their annual yield due to preventable crop diseases and pest infestations. The primary challenge is the lack of immediate access to agricultural experts or pathologists who can diagnose these issues early. Often, by the time an expert visits, the infection has spread too far to be controlled. We need a robust, offline-first mobile application that runs on low-end Android devices common in these markets. The app should utilize computer vision/image recognition to analyze photos of crop leaves taken by the farmer in varying lighting conditions. It must instantly identify common diseases (like Blight, Rust, or Mosaic Virus) and recommend locally available, affordable treatments or chemical interventions. Crucially, given the poor internet connectivity in these fields, the inference model must be lightweight enough to run entirely on-device without needing to upload images to the cloud. We also require a voice-based interface for farmers with low literacy levels, supporting multiple regional dialects.',
        tags: ['#AgriTech', '#Mobile'], engagement: { likes: 89, comments: 12 }, category: 'Agriculture', linkedCount: 5
    },
    {
        id: 'p4', type: 'Problem', author: 'EduFoundation', role: 'NGO', time: '5h ago',
        title: 'Low Bandwidth Video Conferencing',
        summary: 'The shift to remote education has left behind millions of students in developing regions where internet connectivity is unstable, expensive, and slow (often 2G or unstable 3G). Standard video conferencing tools like Zoom or Teams require bandwidths that are simply unavailable, leading to constant disconnects, frozen video, and an inability to participate in synchronous learning. We are looking for a novel video compression algorithm or a specialized conferencing platform optimized for extremely low-bandwidth environments (sub-50kbps). The solution should prioritize audio clarity above all else, perhaps reconstructing facial movements on the client side using AI avatars or keypoint transmission instead of sending full video frames. It must also handle high packet loss gracefully and allow for "store-and-forward" participation where live connection fails. This tool would be pivotal in democratizing access to quality education for remote communities.',
        tags: ['#EdTech', '#Connectivity'], engagement: { likes: 210, comments: 56 }, category: 'Education', linkedCount: 2
    },
    {
        id: 'p5', type: 'Problem', author: 'Metro Transit', role: 'Government', time: '1w ago',
        title: 'Real-time Bus Occupancy Tracking',
        summary: 'Public transit usage is inefficient because commuters have no visibility into the crowdedness of arriving buses. This leads to "bunching," where one bus is packed to crush capacity while the one five minutes behind is empty, causing delays and safety concerns. Installing high-tech camera counters on every old bus in our fleet is too costly and maintenance-heavy. We are seeking a sensor-less or low-infrastructure software solution to estimate passenger density in real-time. Potential approaches could involve analyzing the number of WiFi probe requests from passenger smartphones, using crowdsourced data from an app, or analyzing weight distribution data from suspension sensors if available. The data must be anonymized to protect privacy and aggregated into a simple "Green/Yellow/Red" occupancy indicator available via a public API and displayed on bus stop signage.',
        tags: ['#SmartCity', '#Transportation'], engagement: { likes: 45, comments: 8 }, category: 'Smart Cities', linkedCount: 0
    },
    {
        id: 'p6', type: 'Problem', author: 'GreenEnergy Co', role: 'Startup', time: '2d ago',
        title: 'Efficient Solar Panel Cleaning',
        summary: 'Solar farms in arid and semi-arid regions suffer from rapid dust and sand accumulation, which can reduce energy output by up to 30% in just a few weeks. The current method of cleaning involves manual labor with water trucks, which is not only expensive and slow but also wastes millions of gallons of scarce water resources every year. We are soliciting designs for an automated, water-free cleaning robotic system. The robot should be able to traverse the panel arrays autonomously (perhaps charging from the panels themselves), change rows securely, and effectively remove fine dust without scratching the anti-reflective coating on the glass. It needs to be lightweight to avoid damaging the frames, withstand high ambient temperatures (up to 50°C), and operate primarily at night to avoid shading the panels during generation hours.',
        tags: ['#Energy', '#Robotics'], engagement: { likes: 134, comments: 22 }, category: 'Energy', linkedCount: 4
    },
    {
        id: 'p7', type: 'Problem', author: 'FinSecure', role: 'FinTech', time: '4h ago',
        title: 'Fraud Detection in Micro-Transactions',
        summary: 'As digital wallets and micro-payment platforms grow, we are seeing a massive surge in high-volume, low-value fraudulent transactions (e.g., $1 to $5). Traditional fraud detection systems are often rule-based or optimized for larger amounts, making them too slow or too expensive (in terms of false positives and manual review costs) for micro-transactions. We need a Machine Learning model capable of real-time scoring (<50ms latency) that can detect complex patterns of synthetic identity fraud and account takeovers in this specific domain. The model must learn from graph-based relationship data (e.g., accounts sending money in a circular pattern) and behavioral biometrics (typing speed, device orientation) rather than just transaction thresholds. A successful solution will reduce our fraud loss by 15% without adding significant friction to the user experience.',
        tags: ['#FinTech', '#Security'], engagement: { likes: 78, comments: 15 }, category: 'Finance', linkedCount: 1
    },
    {
        id: 'p8', type: 'Problem', author: 'OceanGuard', role: 'NGO', time: '6h ago',
        title: 'Ghost Net Retrieval',
        summary: 'Ghost nets—fishing nets that have been lost, abandoned, or discarded at sea—continue to trap and kill marine life indiscriminately for decades, including sharks, rays, and sea turtles, and also damage coral reefs. Locating these nets in the vast ocean is chemically and physically difficult. We are looking for a low-cost, durable tagging solution that fishermen can attach to their nets. If a net is lost, the tag should be able to emit a signal (acoustic, radio, or satellite) that allows for its geolocation and retrieval. The challenge is that the tag must be cheap enough (<$10) to be adopted, robust enough to survive crushing depths and saltwater corrosion, and smart enough not to broadcast while in normal use (e.g., activating only after being submerged for a set "lost" duration or upon receiving a specific wake-up signal).',
        tags: ['#Ocean', '#Conservation'], engagement: { likes: 312, comments: 80 }, category: 'Environment', linkedCount: 6
    },
    {
        id: 'p9', type: 'Problem', author: 'LogiChain', role: 'Supply Chain', time: '12h ago',
        title: 'Vaccine Cold Chain Monitoring',
        summary: 'The "last mile" of vaccine delivery in developing countries is fraught with risks; effectively maintaining the cold chain (2°C to 8°C) is difficult during transport on motorbikes or boats. Current electronic loggers are expensive and require USB connection to a computer for readout, which is often unavailable at the destinations. We need a cheap, disposable, ultra-low-power temperature logging label. This smart label should be able to visually indicate if a temperature breach has occurred (e.g., changing color) AND store the granular history data which can be read wirelessly via NFC using any standard smartphone. This would allow health workers to instantly verify the safety of the vaccine vial before administration and upload the audit data to a central cloud for accountability.',
        tags: ['#IoT', '#Health'], engagement: { likes: 156, comments: 34 }, category: 'Health', linkedCount: 2
    },
    {
        id: 'p10', type: 'Problem', author: 'SafeStreets', role: 'Community', time: '1d ago',
        title: 'Pothole Detection System',
        summary: 'Potholes are plaguing our city streets, causing vehicle damage and accidents. The current system relies on citizens manually calling a hotline or submitting a web form, which results in severe under-reporting and slow repair times. We want to automate this discovery process using technology that already exists on the roads. We are looking for a solution that utilizes the sensors (accelerometers, gyroscopes, GPS) in drivers\' smartphones or dashcams to automatically detect the signature jolt of hitting a pothole. This data should be collected passively in the background, aggregated to filter out false positives (e.g., speed bumps), and mapped in real-time to a dashboard for the Public Works department to prioritize repairs. The app must be battery-efficient and respect user privacy by only transmitting location data relevant to road defects.',
        tags: ['#Infrastructure', '#AI'], engagement: { likes: 98, comments: 19 }, category: 'Smart Cities', linkedCount: 3
    }
];

export const dummySolutions = [
    {
        id: 's1', type: 'Solution', author: 'TechStream', role: 'Startup', time: '1d ago',
        title: 'RiverCleaner V2 Drone',
        summary: 'The RiverCleaner V2 is an advanced autonomous surface vehicle (ASV) designed specifically to address the micro-plastic crisis in urban rivers. Unlike fixed barrier systems that can disrupt marine migration, our V2 drone operates as a mobile skimmer. It utilizes a dual-conveyor belt system: the front conveyor collects floating debris and macro-plastics, while a secondary fine-mesh filtration system pumps water through to capture micro-plastics down to 2mm. Powered by a 200W solar array and a high-density LiFePO4 battery, it can operate for 12 hours a day without grid intervention. The unit features LIDAR and computer vision for obstacle avoidance and waste hotspot targeting, using AI to distinguish between organic matter (which it leaves alone) and man-made waste. Initial pilot tests show a collection rate of 50kg of plastic per day with a manufacturing cost of $4,200, fitting squarely within municipal budgets.',
        tags: ['#Robotics', '#CleanWater'], engagement: { likes: 456, comments: 89 }, category: 'Environment',
        linkedTo: { type: 'Problem', title: 'Excessive Plastic Waste (#P1)', id: 'p1' }
    },
    {
        id: 's2', type: 'Solution', author: 'AgroAI', role: 'Student Team', time: '2d ago',
        title: 'LeafScan Pro App',
        summary: 'LeafScan Pro is an offline-first mobile application built on top of the TensorFlow Lite framework, optimized for entry-level Android smartphones ($50-$100 range). We have trained a MobileNetV2 convolutional neural network on a dataset of over 50,000 labeled images of crop diseases prevalent in East Africa and South Asia. The model, which is compressed to under 15MB, resides entirely on the device. When a farmer points their camera at a leaf, the app provides an inference in under 2 seconds with 94.5% accuracy, identifying 15 common pathologies including Late Blight, Powdery Mildew, and Rust. Beyond diagnosis, the app provides an actionable "Treatment Recipe" in the local language, suggesting both chemical and organic remedies available in nearby markets. We also include a text-to-speech feature for accessibility, ensuring that literacy isn\'t a barrier to saving crops.',
        tags: ['#AgriTech', '#Mobile'], engagement: { likes: 120, comments: 34 }, category: 'Agriculture',
        linkedTo: { type: 'Problem', title: 'Crop Disease Detection (#P3)', id: 'p3' }
    },
    {
        id: 's3', type: 'Solution', author: 'CodeWizards', role: 'Innovator', time: '4d ago',
        title: 'LightStream Audio Codec',
        summary: 'LightStream is a proprietary, semantic-based audio compression codec designed to revolutionize remote communication in extremely low-bandwidth environments. Traditional codecs like Opus or AAC transmit audio waveforms, which degrade heavily when bandwidth drops below 20kbps. LightStream takes a different approach: it uses a lightweight Generative Adversarial Network (GAN) on the sender\'s device to extract key speech parameters (pitch, tone, phonemes) and transmits only this semantic metadata, which requires less than 2kbps. The receiver\'s device then "hallucinates" or reconstructs the speech in the speaker\'s voice in real-time. This allows for crystal-clear voice communication even on 2G (GPRS) connections where conventional VoIP fails completely. We have also integrated a whiteboard features that transmits vector instruction sets rather than video streams to facilitate visual learning.',
        tags: ['#EdTech', '#Connectivity'], engagement: { likes: 89, comments: 12 }, category: 'Education',
        linkedTo: { type: 'Problem', title: 'Low Bandwidth Video (#P4)', id: 'p4' }
    },
    {
        id: 's4', type: 'Solution', author: 'SunBot', role: 'Maker', time: '1w ago',
        title: 'DustWiper Sol',
        summary: 'DustWiper Sol is a fully autonomous, water-free cleaning robot for utility-scale solar farms. It addresses the issue of soiling losses without using a single drop of water. The robot mounts on the frame of the solar array and moves laterally along the row. It employs a rotating microfiber brush system combined with an electro-static precipitator bar which charges dust particles, lifting them off the glass surface before they are swept away. This ensures that even fine cement-like dust is removed without abrasive scratching. The bot is powered by its own dedicated solar strip and a battery, waking up every night to perform a cleaning cycle when the panels are not generating power. Our field tests in the Mojave Desert demonstrated a recovery of 98% of lost efficiency after a single pass.',
        tags: ['#Energy', '#Robotics'], engagement: { likes: 210, comments: 45 }, category: 'Energy',
        linkedTo: { type: 'Problem', title: 'Efficient Solar Panel Cleaning (#P6)', id: 'p6' }
    },
    {
        id: 's5', type: 'Solution', author: 'DeepGuard', role: 'Researcher', time: '5h ago',
        title: 'NeuralFraudNet',
        summary: 'NeuralFraudNet is a specialized Long Short-Term Memory (LSTM) autoencoder designed to detect synthetic fraud in micro-transaction streams. Unlike random forest models that look at individual transactions in isolation, our LSTM architecture analyzes the *sequence* of user actions leading up to a transaction (e.g., login timing, page navigation speed, copy-paste behavior). By learning the temporal "rhythm" of a legitimate user, it can flag anomalies with unprecedented precision. We have optimized the inference engine using TensorRT, achieving a latency of 12ms per transaction. This allows the model to sit inline with the payment gateway, blocking fraud in real-time before the money leaves the system. In back-testing on a dataset of 10 million transactions, NeuralFraudNet successfully identified 60% more account takeover attempts than the industry-standard rule engine.',
        tags: ['#FinTech', '#AI'], engagement: { likes: 67, comments: 8 }, category: 'Finance',
        linkedTo: { type: 'Problem', title: 'Fraud Detection (#P7)', id: 'p7' }
    },
    {
        id: 's6', type: 'Solution', author: 'BlueSonar', role: 'NGO', time: '2h ago',
        title: 'NetLocate Acoustic Tag',
        summary: 'NetLocate is a ruggedized, low-cost acoustic pinger designed to mitigate the ghost net problem. The device is the size of a standard fishing float and attaches to the net\'s headline. It contains a pressure sensor and a saltwater conductivity switch. During normal fishing operations, the device is dormant. However, if the net remains submerged at a constant depth for more than 7 days (indicating it is stuck or lost), the device activates, emitting a specific unique identification ping every 30 seconds on a frequency monitorable by standard vessel sonar. The casing is made from a bio-derived polymer that will biodegrade safely after 5 years if never retrieved, preventing the tag itself from becoming pollution. At a price point of $8 per unit, it is a viable insurance policy for fishermen who want to recover their expensive gear.',
        tags: ['#Ocean', '#IoT'], engagement: { likes: 400, comments: 112 }, category: 'Environment',
        linkedTo: { type: 'Problem', title: 'Ghost Net Retrieval (#P8)', id: 'p8' }
    },
    {
        id: 's7', type: 'Solution', author: 'CoolChain', role: 'Startup', time: '3h ago',
        title: 'FreezeTag NFC',
        summary: 'FreezeTag NFC is a printed electronic label that acts as an irreversible temperature indicator and data logger. Manufactured using roll-to-roll printing processes, it costs less than $0.50 per unit. The label uses a chemical layer that changes color from white to red if the temperature exceeds 8°C for more than 30 minutes, giving an immediate visual warning. Beneath this layer is a printed NFC chip with a thin-film battery. This chip logs temperature data points every 15 minutes for up to 30 days. Any logistics worker or nurse with a standard Android phone can tap the label to download the full temperature history graph, proving whether the vaccine remained in the safe range throughout its journey. The data is cryptographically signed to prevent tampering.',
        tags: ['#IoT', '#Health'], engagement: { likes: 189, comments: 40 }, category: 'Health',
        linkedTo: { type: 'Problem', title: 'Vaccine Cold Chain (#P9)', id: 'p9' }
    },
    {
        id: 's8', type: 'Solution', author: 'RoadAI', role: 'Developer', time: '1d ago',
        title: 'PotholePal Dashcam App',
        summary: 'PotholePal is a crowdsourcing app that turns every driver into a road inspector. It runs in the background and monitors the phone\'s accelerometer for Z-axis spikes characteristic of hitting a pothole. To avoid false positives (like speed bumps or hard braking), we employ a secondary verification layer using the phone\'s camera or a connected dashcam. When a jolt is detected, the app captures the last 5 seconds of video and runs a lightweight computer vision check to visually confirm the presence of a road defect. Confirmed potholes are geotagged and uploaded to a public heatmap. We also offer an API for municipal governments, providing them with a real-time severity map of road conditions, helping them optimize their repair crews\' routes and budget.',
        tags: ['#Infrastructure', '#App'], engagement: { likes: 112, comments: 22 }, category: 'Smart Cities',
        linkedTo: { type: 'Problem', title: 'Pothole Detection (#P10)', id: 'p10' }
    },
    {
        id: 's9', type: 'Solution', author: 'MedFlow', role: 'Institution', time: '12h ago',
        title: 'TriageAssist AI',
        summary: 'TriageAssist AI is a clinical decision support system integrated into hospital kiosks. Patients arriving at the ER input their primary complaints and symptoms into a tablet interface available in multiple languages. The system uses Natural Language Processing (NLP) to parse the inputs and cross-references them with standard triage protocols (ESI levels). It can immediately flag "Category 1 or 2" high-risk patients (e.g., potential stroke or cardiac arrest) and trigger a silent alarm for the charge nurse. For lower acuity cases, it provides an estimated wait time and educational content. The backend dashboard gives hospital administrators a real-time forecast of patient influx 2 hours into the future, allowing them to proactively call in on-call staff before the waiting room reaches critical capacity.',
        tags: ['#Healthcare', '#DataScience'], engagement: { likes: 78, comments: 14 }, category: 'Health',
        linkedTo: { type: 'Problem', title: 'Patient Queue Management (#P2)', id: 'p2' }
    },
    {
        id: 's10', type: 'Solution', author: 'WiFiSense', role: 'Researcher', time: '6d ago',
        title: 'Passive WiFi Counting',
        summary: 'Our solution, WiFiSense, leverages the existing WiFi infrastructure found on modern buses for accurate crowd counting without privacy invasion. We installed a small firmware update on standard bus routers to listen for "Probe Requests"—signals that smartphones constantly broadcast to find known networks. By filtering these requests using randomized MAC address hashing and signal strength (RSSI) triangulation, we can distinguish between a passenger inside the bus and a person walking on the sidewalk nearby. This provides a real-time count of devices on board, which correlates 95% with actual passenger headcount. This data is fed into the city\'s GTFS-Realtime feed, allowing Google Maps and other transit apps to display "Crowdedness" levels to waiting passengers, encouraging them to wait for the next, emptier bus.',
        tags: ['#SmartCity', '#Wireless'], engagement: { likes: 56, comments: 9 }, category: 'Smart Cities',
        linkedTo: { type: 'Problem', title: 'Bus Occupancy Tracking (#P5)', id: 'p5' }
    }
];
