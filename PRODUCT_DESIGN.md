# InnoLink Technical Design & Product Roadmap

## 1. Product Management Structure

### 1.1 Content Lifecycle States
All core entities (Problems, Ideas, Solutions) follow this lifecycle:
- **Draft**: Only visible to the author.
- **Temporarily Registered**: AI-validated, awaiting final user confirmation or automated moderation.
- **Published**: Publicly visible in the feed.
- **Archived**: Hidden from the feed but accessible via direct link or author profile.
- **Flagged**: Restricted content under moderator review.

### 1.2 Feature Ownership & Hierarchy
- **Problem**: Owned by the Reporter (Innovator/User). Can be linked to multiple Ideas.
- **Idea**: Owned by the Innovator. Must be linked to a Problem (optional for general ideas).
- **Solution**: Owned by the Developer/Innovator. Must be linked to an Idea.
- **Poll**: Attached to a Problem or Idea to gauge community interest.

### 1.3 Dependencies
- A **Solution** cannot exist without an **Idea**.
- An **Idea** is significantly more valuable when linked to a verified **Problem**.

---

## 2. Product Analytics Design

### 2.1 Engagement Metrics (Public)
- **Impact Score**: Calculated based on (Likes * 1 + Comments * 2 + Reposts * 5).
- **Conversion Rate**: Percentage of Problems that receive at least one Idea.
- **Idea Maturity**: Percentage of Ideas that transition to Solutions.

### 2.2 Investor Interest Signals (Private for Admins/Investors)
- **Bookmarks**: Tracks how many investors saved a specific Idea.
- **Contact Requests**: Number of direct messages initiated from an Idea page.
- **Trend Index**: Velocity of engagement in the last 24 hours.

### 2.3 User Growth & Retention
- **Active Innovators**: Users who posted at least 1 Idea in 30 days.
- **Solved Problems**: Total count of Problems linked to at least one 'Published' Solution.

---

## 3. Admin Dashboard Design

### 3.1 Real-time Monitoring
- **Global Feed Activity**: Live stream of new posts and comments.
- **Violation Queue**: List of content flagged by the community or automated filters.

### 3.2 User Management
- **Role Assignment**: Elevate Innovators to Investors or Admins.
- **Ban/Suspend**: Restrict access for policy violations.
- **Verification**: Batching "Verified" status to expert profiles.

### 3.3 Analytics Visualization
- **Category Heatmap**: Identifying which tags (e.g., #AI, #EdTech) have the highest problem-to-solution conversion.
- **System Health**: Uptime, Firebase usage patterns, and error logs.

---

## 4. Implementation Roadmap

### Phase 1: MVP (Completed/In Progress)
- Firebase Auth & Basic Role Storage.
- Real-time Feed (Problems, Ideas, Solutions).
- Like/Comment System.
- Media Uploads (Storage).

### Phase 2: Enhanced Interactivity (Next)
- Real-time Notifications.
- Poll implementation and visualization.
- Semantic Similarity AI (Gemini) Integration.

### Phase 3: Governance & Growth
- Full Admin Dashboard UI.
- Automated Content Moderation.
- Investor-exclusive discovery tools.
