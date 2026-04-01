import { useState } from "react";
import toast from "react-hot-toast";

type SubmitCallback = (data: Record<string, string>) => Promise<any>;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong. Please try again.";
}

export const useGenericSubmitHandler = (callback: SubmitCallback) => {
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    

    setLoading(true);  

    const formData = new FormData(e.currentTarget);

    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value?.toString();
    });

    try {
      await callback(data);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit, loading };
};