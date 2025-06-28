import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const formSchema = z.object({
  email: z.string().email().min(2).max(50),
})
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
   function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className=' bg-black w-screen h-screen overflow-hidden p-15 '>
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md mx-auto h-[520px] p-6 bg-[#0A090A] rounded-lg shadow-md mt-3 w-[300px]">
        <h1 className="text-2xl font-bold text-white">Forgot Password ?</h1>
        <p className="text-gray-600 m-3">No worries, we'll send you a link <br /> to reset your password.</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white mt-5 mb-5">Email</FormLabel>
              <FormControl className="text-white">
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-[#DCFC35] text-black" type="submit">Reset Password</Button>
        <div className="flex items-center gap-2 justify-center mt-4">
          <Link to="/login" className="text-white flex items-center gap-2">
          <img src="/src/assets/return.png" alt="" /> 
          <span>Back to Login</span>
        </Link>
        </div>
      </form>
    </Form>
    </div>
  )
}

export default ForgotPassword
