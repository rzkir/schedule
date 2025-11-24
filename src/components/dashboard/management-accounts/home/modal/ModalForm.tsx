import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ManagementAccounts } from "@/types/ManagementAccounts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Add Combobox component for type and provider selection
function Combobox({
  label,
  name,
  options,
  value,
  onChange,
  loading = false,
  placeholder = "Pilih...",
}: {
  label: string;
  name: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  // Find the selected option by id, not name
  const selectedOption = options.find((opt) => opt.id === value);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
            disabled={loading}
          >
            {selectedOption ? selectedOption.name : placeholder}
            <ChevronsUpDown className="opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={`Cari ${label.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={opt.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {opt.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === opt.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface ModalFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  form: Omit<ManagementAccounts, "id" | "createdAt" | "updatedAt">;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  addAccount: () => void;
  types: { id: string; type: string }[];
  providers: { id: string; provider: string }[];
  loadingTypes: boolean;
  loadingProviders: boolean;
}

export default function ModalForm({
  open,
  setOpen,
  loading,
  form,
  handleInputChange,
  addAccount,
  types,
  providers,
  loadingTypes,
  loadingProviders,
}: ModalFormProps) {
  // Convert types and providers to the format expected by Combobox
  const typeOptions = types.map((t) => ({ id: t.id, name: t.type }));
  const providerOptions = providers.map((p) => ({
    id: p.id,
    name: p.provider,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-colors px-6 py-2 rounded-lg">
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {form.name ? "Edit Account" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {form.name
              ? "Edit the details below to update the account"
              : "Fill in the details below to create new account"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addAccount();
          }}
          className="space-y-6 overflow-y-auto pr-2 py-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="px-1">
              Account Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Account Name"
              value={form.name || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="px-1">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="px-1">
              Password
            </Label>
            <Input
              type="text"
              name="password"
              id="password"
              placeholder="Password"
              value={form.password || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Provider Combobox */}
            <Combobox
              label="Provider"
              name="provider"
              options={providerOptions}
              value={form.provider || ""}
              onChange={(val) =>
                handleInputChange({
                  target: { name: "provider", value: val, type: "text" },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              loading={loadingProviders}
              placeholder="Pilih Provider"
            />
            {/* Type Combobox */}
            <Combobox
              label="Type"
              name="type"
              options={typeOptions}
              value={form.type || ""}
              onChange={(val) =>
                handleInputChange({
                  target: { name: "type", value: val, type: "text" },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              loading={loadingTypes}
              placeholder="Pilih Type"
            />
          </div>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? "Menambah..." : "Tambah"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-border px-4 py-2 rounded-lg"
              >
                Batal
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
