import { component$, useStore, $ } from '@builder.io/qwik';
// import { checkUser } from "~/server/load-db"; 
export default component$(() => {
  const state = useStore({
    username: '',
    password: '',
    error: '',
  });
  

  // TODO: Implement the database check & call it here.
  const handleSubmit = $(async () => {
    // if (await checkUser(state.username, state.password)) {
      alert('Login successful!');
    // } else {
    //   state.error = 'Invalid username or password';
    // }
  });

  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md p-8 rounded bg-front">
        <h2 class="mb-4 text-2xl font-bold text-center text-white">Login</h2>
        <form preventdefault:submit onSubmit$={handleSubmit}>
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-white">
              Username:
            </label>
            <input
              type="text"
              class="w-full px-4 py-2 text-white bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={state.username}
              onInput$={(e) => (state.username = (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-white">
              Password:
            </label>
            <input
              type="password"
              class="w-full px-4 py-2 text-white bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={state.password}
              onInput$={(e) => (state.password = (e.target as HTMLInputElement).value)}
            />
          </div>
          {state.error && (
            <div class="mb-4 text-sm text-red-400">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            class="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
});
