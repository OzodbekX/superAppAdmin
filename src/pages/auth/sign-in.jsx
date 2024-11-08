import React, { useState } from 'react'
import { Button, Input, Typography } from '@material-tailwind/react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import { useNavigate } from 'react-router-dom'

export function SignIn() {
  const [name, setName] = useState('')
  const [phoneNumber, setPassword] = useState('')
  const [errors, setErrors] = useState({ name: '', phoneNumber: '' })
  const { setToken, setUserName } = userStore((state) => state)
  const navigate = useNavigate()

  // React Query mutation for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data?.accessToken)
      navigate('/')
      // Handle successful login (e.g., redirect to dashboard)
    },

    onError: (error) => {
      // Handle login error (e.g., show error message)
    },
  })

  const validate = () => {
    let valid = true
    let newErrors = { name: '', phoneNumber: '' }

    if (!name) {
      newErrors.name = 'Email is required.'
      valid = false
    }
    // else if (!/\S+@\S+\.\S+/.test(name)) {
    //   newErrors.name = 'Email address is invalid.'
    //   valid = false
    // }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Номер телефона обязателен.'
      valid = false
    } else if (phoneNumber.length < 6) {
      newErrors.phoneNumber = 'Номер телефона must be at least 6 characters long.'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      setUserName(name)
      mutation.mutate({ name, phoneNumber })
    }
  }

  return (
      <section className="m-8 flex gap-4">
        <div className="w-full lg:w-3/5 mt-24">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Войти
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
              Введите свое имя и номер телефона для входа.
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Введите свое имя
              </Typography>
              <Input
                  size="lg"
                  placeholder="введите свое имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name !== ''}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
              />
              {errors.name && (
                  <Typography variant="small" color="red" className="-mt-4">
                    {errors.name}
                  </Typography>
              )}
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Номер телефона
              </Typography>
              <Input
                  type="number"
                  size="lg"
                  value={phoneNumber}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.phoneNumber !== ''}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
              />
              {errors.phoneNumber && (
                  <Typography variant="small" color="red" className="-mt-4">
                    {errors.phoneNumber}
                  </Typography>
              )}
            </div>
            <Button className="mt-6" fullWidth type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Вход в систему...' : 'Войти'}
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
