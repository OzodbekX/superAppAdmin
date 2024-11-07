import React, { useState } from 'react'
import { Button, Input, Typography } from '@material-tailwind/react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import { useNavigate } from 'react-router-dom'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const setToken = userStore((state) => state.setToken)
  const navigate = useNavigate()

  // React Query mutation for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwicm9sZSI6Ik9QRVJBVE9SIiwiZXhwIjoxNzMxMzMzODYwLCJ1c2VySWQiOjIsImlhdCI6MTczMDk3Mzg2MH0.HzBkMjvS0PqpR7jMhqFREpmcXDAiJA2aWMrRX1ut_mD5vcAoeKFCRaGaPTUJ7fvojiSALFT_4JNbg2wL9c6XpQ'
      )
      navigate('/')
      // Handle successful login (e.g., redirect to dashboard)
    },

    onError: (error) => {
      // Handle login error (e.g., show error message)
    },
  })

  const validate = () => {
    let valid = true
    let newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = 'Email is required.'
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.'
      valid = false
    }

    if (!password) {
      newErrors.password = 'Password is required.'
      valid = false
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      setToken(
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwicm9sZSI6Ik9QRVJBVE9SIiwiZXhwIjoxNzMxMzMzODYwLCJ1c2VySWQiOjIsImlhdCI6MTczMDk3Mzg2MH0.HzBkMjvS0PqpR7jMhqFREpmcXDAiJA2aWMrRX1ut_mD5vcAoeKFCRaGaPTUJ7fvojiSALFT_4JNbg2wL9c6XpQ'
      )
      navigate('/')

      // mutation.mutate({email, password});
    }
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email !== ''}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="-mt-4">
                {errors.email}
              </Typography>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password !== ''}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            {errors.password && (
              <Typography variant="small" color="red" className="-mt-4">
                {errors.password}
              </Typography>
            )}
          </div>
          <Button className="mt-6" fullWidth type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
      </div>
    </section>
  )
}

export default SignIn
