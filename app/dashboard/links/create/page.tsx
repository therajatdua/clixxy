import DashboardHeader from "@/components/dashboard/Header";
import CreateLinkForm from "@/components/links/CreateLinkForm";

export default function CreateLinkPage() {
    return (
        <div>
            <DashboardHeader title="Create Tracking Link" />
            <div className="p-6 animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-2xl font-medium uppercase tracking-widest text-text-primary mb-1">New Tracking Link</h2>
                    <p className="text-text-secondary font-bold uppercase tracking-wider text-sm">
                        Create a short link that captures platform, device, and country analytics on every click.
                    </p>
                </div>
                <div className="card rounded-xl p-6 border border-solid border-border bg-bg">
                    <CreateLinkForm />
                </div>
            </div>
        </div>
    );
}
