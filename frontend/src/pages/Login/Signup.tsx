import AnimationLogin from "@/components/AnimationLogin"
import { z } from "zod"
 import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
})

const Signup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <div className=' bg-black w-screen h-screen overflow-hidden'>
        <div className='flex flex-col lg:flex-row items-center justify-center h-full'>
            <AnimationLogin />
            {/* form */}

            <div className="max-w-md mx-auto h-[540px] p-6 bg-[#0A090A] rounded-lg shadow-md mt-3 ">
          <div className="text-center mt-8">
          <h1 className="text-2xl font-bold text-white">Hello Again!</h1>
          <p className="text-gray-600 m-3">Please enter your details <br /> to create an account.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
           
            {/* mt */}
            <Button className="w-full text-black bg-[#DCFC35] hover:text-white" type="submit">Sign up</Button>
          <div className="flex items-center gap-2">
              <Separator className="flex-1 h-px bg-gray-300" />
              <p className="text-center text-sm text-gray-500">or</p>
              <Separator className="flex-1 h-px bg-gray-300" />
          </div>
          
          </form>
        </Form>
        <div className="flex flex-col gap-4 mt-6">
          <Button className="w-full border-2 border-white bg-[#0A090A] mb-3"  onClick={() => console.log("Login with Google")}>
             <img 
             className='h-4 mr-2 inline-block'
              src="/src/assets/google.png" 
              alt="logo-google"
              /> Login with Google
            </Button>
            <Button className="w-full border-2 border-white bg-[#0A090A] text-white"  onClick={() => console.log("Login with Reconnaissance Facial")}>
              <img
               className=''
               src="/src/assets/identite-faciale .png"
               alt=""
              /> Login with Reconnaissance Facial
            </Button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            I have an account?{" "}
            <a href="/login" className="text-[#DCFC35] hover:underline">
              Sign in
            </a>
          </p>
        </div>

        
            </div>
        </div>
          
        
        
    </div>
  )
}

export default Signup