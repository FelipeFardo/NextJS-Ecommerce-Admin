"use client";

import * as z from "zod";
import { useState } from "react";
import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formShema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formShema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formShema),
    defaultValues: initialData,
  });

  
  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      await toast.promise(axios.patch(`/api/stores/${params.storeId}`, data), {
        loading: "Saving...",
        success: () => {
          router.refresh();
          return "Store update";
        },
        error: "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleted = async () => {
    setIsLoading(true);
    try {
      await toast.promise(axios.delete(`/api/stores/${params.storeId}`), {
        loading: "Deleting...",
        success: () => {
          router.refresh();
          router.push("/");
          return "Store deleted";
        },
        error: "Make sure you removed all products and categories first",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDeleted}
        loading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Trash className="h-4 w-4 " />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 pag-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Store name"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
