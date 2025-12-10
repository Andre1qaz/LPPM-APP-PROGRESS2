import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useForm, usePage } from "@inertiajs/react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Check, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { route } from "ziggy-js";

export function HakAksesChangeDialog({
    dataEdit,
    dialogTitle,
    openDialog,
    setOpenDialog,
}) {
    const { optionRoles = [] } = usePage().props;

    // Role sesuai SRS Seminar
    const defaultRoles = [
        "Admin", 
        "Dosen", 
        "Reviewer", 
        "Kprodi", 
        "LppmKetua", 
        "LppmAnggota", 
        "Keuangan", 
        "Hrd"
    ];
    
    const roles = optionRoles.length > 0 ? optionRoles : defaultRoles;

    const [isOpenSelectUser, setIsOpenSelectUser] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [debouncedSearchUser] = useDebounce(searchUser, 500);
    const [dataUserId, setDataUserId] = useState("");
    const [loadingSearchUser, setLoadingSearchUser] = useState(false);
    const [users, setUsers] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        userId: "",
        hakAkses: [],
    });

    useEffect(() => {
        if (dataEdit && dataEdit.userName) {
            setData("hakAkses", dataEdit.hakAkses || []);
            setDataUserId(dataEdit.userId || "");
        } else {
            setData("hakAkses", []);
            setDataUserId("");
        }
    }, [dataEdit]);

    useEffect(() => {
        if (dataUserId) {
            setData("userId", dataUserId);
        }
    }, [dataUserId]);

    // FETCH USER (PERBAIKAN UTAMA DISINI)
    useEffect(() => {
        const fetchUsers = async () => {
            if (!debouncedSearchUser.trim()) return;

            setLoadingSearchUser(true);

            try {
                // Ambil token dari LocalStorage (sesuai mekanisme login referensi)
                const authToken = localStorage.getItem("authToken");
                
                // Gunakan POST sesuai definisi di routes/api.php
                // Sertakan Header Authorization agar backend bisa bicara ke API Kampus
                const response = await axios.post(
                    route("api.fetch-users"),
                    { search: debouncedSearchUser },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                let usersData = [];
                if (response.data.data?.users) {
                    usersData = response.data.data.users;
                } else if (response.data.users) {
                    usersData = response.data.users;
                } else if (Array.isArray(response.data.data)) {
                    usersData = response.data.data;
                }

                const formattedUsers = usersData.map((user) => ({
                    id: user.id,
                    value: user.id,
                    label: `(${user.username || user.email}) ${user.name}`,
                }));

                setUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users", error);
                setUsers([]);
            } finally {
                setLoadingSearchUser(false);
            }
        };

        fetchUsers();
    }, [debouncedSearchUser]);

    useEffect(() => {
        if (!openDialog) {
            setSearchUser("");
            setDataUserId("");
            setUsers([]);
            setIsOpenSelectUser(false);
        }
    }, [openDialog]);

    const handleSubmit = () => {
        if (!data.userId) {
            alert("Silahkan pilih pengguna terlebih dahulu.");
            return;
        }
        post(route("hak-akses.change-post"), {
            onSuccess: () => setOpenDialog(false)
        });
    };

    return (
        <Sheet open={openDialog} onOpenChange={setOpenDialog}>
            <SheetContent aria-describedby="form-dialog" className="w-[400px] sm:w-[540px]">
                <SheetHeader className="pb-4">
                    <SheetTitle>{dialogTitle}</SheetTitle>
                    <SheetDescription>
                        Silahkan isi data hak akses pada form di bawah ini.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="mb-6" />

                <div className="grid gap-6 px-1">
                    {dataEdit && dataEdit.userName ? (
                        <div className="grid gap-2">
                            <Label>Pengguna</Label>
                            <Input value={dataEdit.userName} disabled className="bg-muted" />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label>Pilih Pengguna</Label>
                            <Popover open={isOpenSelectUser} onOpenChange={setIsOpenSelectUser}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isOpenSelectUser}
                                        className="justify-between w-full font-normal"
                                    >
                                        {dataUserId
                                            ? users.find((u) => u.value === dataUserId)?.label || 
                                              "User terpilih (ID: " + dataUserId + ")"
                                            : "Cari nama atau email..."}
                                        <ChevronsUpDownIcon className="w-4 h-4 opacity-50 shrink-0" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0 w-[350px]">
                                    <Command>
                                        <CommandInput
                                            placeholder="Ketik nama..."
                                            value={searchUser}
                                            onValueChange={setSearchUser}
                                        />
                                        <CommandList>
                                            <CommandEmpty>
                                                {loadingSearchUser ? (
                                                    <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                                                        <Spinner className="w-4 h-4 mr-2" />
                                                        Mencari...
                                                    </div>
                                                ) : (
                                                    "Tidak ada hasil yang sesuai."
                                                )}
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {users.map((itemUser) => (
                                                    <CommandItem
                                                        key={itemUser.id}
                                                        value={itemUser.label}
                                                        onSelect={() => {
                                                            setDataUserId(itemUser.value);
                                                            setIsOpenSelectUser(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                dataUserId === itemUser.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {itemUser.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    <div className="grid gap-3">
                        <Label>Hak Akses (Role)</Label>
                        <div className="p-4 border rounded-md">
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map((role, index) => (
                                    <div key={`${role}-${index}`} className="flex items-start space-x-2">
                                        <Checkbox
                                            id={`role-${index}`}
                                            checked={data.hakAkses.includes(role)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData("hakAkses", [...data.hakAkses, role]);
                                                } else {
                                                    setData(
                                                        "hakAkses",
                                                        data.hakAkses.filter((r) => r !== role)
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`role-${index}`}
                                            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {errors.hakAkses && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.hakAkses}
                            </p>
                        )}
                    </div>
                </div>

                <SheetFooter className="mt-8">
                    <SheetClose asChild>
                        <Button variant="outline" disabled={processing}>
                            Batal
                        </Button>
                    </SheetClose>
                    <Button onClick={handleSubmit} disabled={processing}>
                        {processing ? (
                            <>
                                <Spinner className="w-4 h-4 mr-2" /> Menyimpan...
                            </>
                        ) : (
                            "Simpan Perubahan"
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default HakAksesChangeDialog;