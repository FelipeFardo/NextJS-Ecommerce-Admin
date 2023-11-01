"use client";

import * as z from "zod";
import { useState } from "react";
import { Color } from "@prisma/client";
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

const formShema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, { message: "String must be a valid hex code" }),
});

type ColorFormValues = z.infer<typeof formShema>;

interface ColorFormProps {
  initialData: Color | null;
}


export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit color." : "Created color.";
  const description = initialData ? "Edit a color." : "Add a new color.";
  const toastMessageSuccess = initialData ? "Color update." : "Color Created.";
  const toastMessageLoading = initialData ? "Updating..." : "Creating...";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formShema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setIsLoading(true);

      await toast.promise(initialData ?
        axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data) :
        axios.post(`/api/${params.storeId}/colors`, data), {
        loading: toastMessageLoading,
        success: (response) => {
          router.refresh();
          router.push(`/${params.storeId}/colors`);
          return toastMessageSuccess;
        },
        error: "Something went wrong."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await toast.promise(axios.delete(`/api/${params.storeId}/colors/${params.colorId}`), {
        loading: "Deleting...",
        success: () => {
          router.refresh();
          router.push(`${params.storeId}/colors`);
          return "Color deleted.";
        },
        error: "Make sure you removed all products using this color first.",
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
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>)}
      </div >
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
