import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
});

interface FormKidsCreatorProps {
  onSubmit: (username: string) => void;
  onClose: () => void;
}

const FormKidsCreator = ({ onSubmit, onClose }: FormKidsCreatorProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.username);
    form.reset();
    onClose();
  };

  return (
    <div className="w-[200px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-full">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg">Créer un profil</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez le nom d'utilisateur"
                    {...field}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              Créer le profil
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormKidsCreator;
