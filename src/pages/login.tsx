import { getCsrfToken, signIn } from 'next-auth/react'
import { useState } from 'react'

export default function Login({ csrfToken }: { csrfToken: string }) {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        method="post"
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await signIn('credentials', {
            redirect: false,
            email: (e.currentTarget.email as HTMLInputElement).value,
            password: (e.currentTarget.password as HTMLInputElement).value,
          })
          if (res?.error) setError('Email atau password salah')
          else window.location.href = '/admin'
        }}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Masuk ke Admin
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <label className="block mb-2 text-gray-700 dark:text-gray-300">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full mb-4 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="block mb-2 text-gray-700 dark:text-gray-300">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full mb-6 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Masuk
        </button>
      </form>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  return { props: { csrfToken: await getCsrfToken(context) } }
}
