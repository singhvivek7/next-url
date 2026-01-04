import { PolicyLayout } from "@/components/landing/policy-layout";

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms of Service" lastUpdated="January 1, 2026">
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                <p>Welcome to NextURL. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Accounts</h2>
                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Usage Policies</h2>
                <p>You agree not to use the Service to shorten links that redirect to malicious, illegal, or phishing websites. We reserve the right to disable any link that violates our policies without notice.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of NextURL and its licensors.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Termination</h2>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
                <p>In no event shall NextURL, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
            </section>
        </PolicyLayout>
    );
}
