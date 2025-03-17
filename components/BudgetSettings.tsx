"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Budget, CATEGORIES } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
  budgets: z.array(
    z.object({
      category: z.string(),
      amount: z.number().min(0, "Budget must be 0 or greater"),
    })
  ),
});

type BudgetSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  budgets: Budget[];
  onSave: (budgets: Budget[]) => void;
};

export default function BudgetSettings({
  isOpen,
  onClose,
  budgets,
  onSave,
}: BudgetSettingsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgets: CATEGORIES.map((category) => ({
        category,
        amount: 0,
      })),
    },
  });

  useEffect(() => {
    const defaultBudgets = CATEGORIES.map((category) => {
      const existingBudget = budgets.find((b) => b.category === category);
      return {
        category,
        amount: existingBudget?.amount || 0,
      };
    });
    form.reset({ budgets: defaultBudgets });
  }, [budgets, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values.budgets.filter((b) => b.amount > 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Monthly Budget Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map((category, index) => (
                <FormField
                  key={category}
                  control={form.control}
                  name={`budgets.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{category}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Budgets</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
