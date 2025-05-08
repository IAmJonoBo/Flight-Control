const Login = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-2xl font-semibold mb-4">Login</h2>
    <form className="flex flex-col gap-2 w-64">
      <input type="text" placeholder="Username" className="border p-2 rounded" />
      <input type="password" placeholder="Password" className="border p-2 rounded" />
      <button type="submit" className="bg-brand text-white p-2 rounded">Sign In</button>
    </form>
  </div>
);

export default Login;