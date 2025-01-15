import React, { useEffect } from 'react'
import { Typography } from '@material-tailwind/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchNews, fetchStaff, login } from '@/utils/api/functions.js'
import { userStore } from '@/utils/zustand.js'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd'

export function SignIn() {
  const { staffId, setToken, setUserName, setStaffId } = userStore((state) => state)
  const navigate = useNavigate()
  const [loginForms] = Form.useForm()

  const { data: userData } = useQuery({
    queryKey: ['fetchNews', staffId], // The query key depends on the page and pageSize
    queryFn: () => fetchStaff(staffId), // Fetch the correct page
    retry: false,
    gcTime: 20 * 60 * 1000,
    staleTime: 'Infinity',
  })

  useEffect(() => {
    if (userData) {
      setUserName(userData?.name)
      navigate('/')
    }
  }, [userData?.id])
  // React Query mutation for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data?.data.accessToken)
      setStaffId(data.data.id)
      // Handle successful login (e.g., redirect to dashboard)
    },

    onError: (error) => {
      // Handle login error (e.g., show error message)
    },
  })

  const onFinish = (values) => {
    mutation.mutate(values)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24 flex flex-col align-middle items-center ">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Войти
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Пожалуйста, введите ваш логин и пароль для входа
          </Typography>
        </div>
        <Form
          name="login"
          className={'mt-4 w-2/4'}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={loginForms}
        >
          {/* Login Field */}
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Пожалуйста, введите логин!' }]}
          >
            <Input placeholder="Введите ваш логин" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password placeholder="Введите ваш пароль" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className={'bg-gray-600'} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
      </div>
    </section>
  )
}

export default SignIn
