import GoogleLoginComponent from "@/components/auth/GoogleLoginComponent";

export default function Page(): JSX.Element {

    return (
        <main className="max-w-[50ch] md:max-w-[75ch] mx-auto p-4 text-wrap transition-[max-width]">
            <h1 className="text-3xl">Login</h1>
            <GoogleLoginComponent />
        </main>
    );

}