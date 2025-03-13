import GoogleLoginComponent from "@/components/auth/GoogleLoginComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Text Review | Login"
}

export default function Page(): JSX.Element {

    return (

        <div className="flex flex-col h-screen sm:items-center sm:justify-center">
        
        <main className="sm:border-4 border-gray-100 flex flex-col gap-y-6 sm:mx-auto p-4 sm:rounded-lg sm:w-lg">
            <h1 className="text-3xl">Log in</h1>
            <p>Sign in to store and view your analyses from anywhere.</p>
            <GoogleLoginComponent />
        </main>

        </div>

    );

}