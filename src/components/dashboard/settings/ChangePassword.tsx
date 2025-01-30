import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "@/lib/schema";
import { z } from "zod";
import { useChangePassword } from "@/lib/api/mutations";
import Spinner from "@/components/Spinner";

function ChangePassword() {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const userSessionDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { staffId } = userSessionDetails;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    await changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      staffId,
    });
    reset();
  };

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg p-6 mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Change Your Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            {...register("oldPassword")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.oldPassword && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.oldPassword.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.newPassword && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.newPassword.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm font-normal pt-1">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/70 focus:outline-none"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
