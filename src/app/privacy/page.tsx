import { PolicyLayout } from "@/components/landing/policy-layout";

export default function PrivacyPage() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="January 1, 2026">
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information Collection</h2>
                <p>We collect information you provide directly to us, such as when you create an account, create a short link, or contact us. This may include your name, email address, and billing information.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Usage Data & Analytics</h2>
                <p>We automatically collect certain information when you access our services, including IP address, browser type, and interaction data. For short links, we collect click data including the visitor's IP address (for geolocation), device type, and referrer.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, to generate analytics for our users, and to detect and prevent abuse.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Cookies</h2>
                <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Retention</h2>
                <p>We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.</p>
            </section>
        </PolicyLayout>
    );
}
