export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Welcome!</h2>
            <p className="text-muted-foreground">
              You have successfully signed in to your dashboard.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Quick Stats</h2>
            <p className="text-muted-foreground">
              Your dashboard analytics will appear here.
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <p className="text-muted-foreground">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
