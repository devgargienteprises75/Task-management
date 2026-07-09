import { useState } from "react"
import useAuth from "../hooks/useAuth";

const Login = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const credentials = {
        email,
        password
    }

    const { handleLogin } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await handleLogin(credentials)
        console.log(res);

        setEmail('')
        setPassword('')
    }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
        <h2>Dummy Login UI</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    required
                />
            </div>

            <button 
                type="submit" 
                style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
            >
                Login
            </button>
        </form>
    </div>
  )
}

export default Login