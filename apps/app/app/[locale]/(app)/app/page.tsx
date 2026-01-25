import type { Metadata } from "next";

const title = "App";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const AppPage = () => (
  <div className="flex h-svh flex-col items-center justify-center">
    <h1 className="font-bold text-4xl">Welcome to App</h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default AppPage;
