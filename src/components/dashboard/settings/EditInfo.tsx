import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditInfoSchema } from "@/lib/schema";
import { z } from "zod";
import { useUpdateUserInfo } from "@/lib/api/mutations";
import Spinner from "@/components/Spinner";
import { useEffect } from "react";
import apiClient from "@/helpers/apiClient";

function EditInfo() {
  const { mutateAsync: updateUserInfo, isPending } = useUpdateUserInfo();
  const userSessionDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { staffId } = userSessionDetails;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof EditInfoSchema>>({
    resolver: zodResolver(EditInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = staffId ? `/users/${staffId}` : `/users`;
        const response = await apiClient.get(url);
        setValue("firstName", response.data.firstName);
        setValue("lastName", response.data.lastName);
        setValue("phoneNumber", response.data.phoneNumber);
        setValue("address", response.data.address);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [staffId]);

  const onSubmit = async (data: z.infer<typeof EditInfoSchema>) => {
    await updateUserInfo({
      ...data,
      staffId,
    });
    reset();
  };

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg p-6 mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Edit Your Information
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            {...register("firstName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.firstName && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.firstName.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.lastName && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.lastName.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            {...register("address")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            autoComplete="email"
          />
          {errors.address && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.address.message}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            autoComplete="tel"
          />
          {errors.phoneNumber && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.phoneNumber.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/70 focus:outline-none"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditInfo;
