
export const GET =() => {
    console.log("✅ /user/profile GET handler called!");
    return new Response(JSON.stringify({ message: "Profile found!" }), { status: 200 });
};
