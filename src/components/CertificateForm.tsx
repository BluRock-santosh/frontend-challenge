import { useForm, Resolver, FieldErrors, SubmitHandler } from "react-hook-form";
import { FormValues } from "../types/certificate.type";
import { CustomInput } from "./CustomInput";
import { Upload } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../assets/hooks/reduxHook";
import { addCertificate, removeCertificate } from "../redux/certificateSlice";
import { useState } from "react";

const resolver: Resolver<FormValues> = async (values) => {
  const errors: FieldErrors<FormValues> = {};

  if (!values.cerificationName) {
    errors.cerificationName = {
      type: "required",
      message: "Certification Name is required",
    };
  }
  if (!values.issuerName) {
    errors.issuerName = {
      type: "required",
      message: "Issuer name is required",
    };
  }
  if (!values.file || values.file.length === 0) {
    errors.file = {
      type: "required",
      message: "File is required",
    };
  } else {
    const file = values.file[0];
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      errors.file = {
        type: "invalid",
        message: "Only PDF or JPG files are allowed",
      };
    }
  }
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export default function CertificateForm() {
  const dispatch = useAppDispatch();
  const certificates = useAppSelector((state) => state.certificate);
  const [screen, setScreen] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (certificates.length >= 5) {
      alert("You cannot add more than 5 certificates.");
      return;
    }

    const file = data.file?.[0] || null;
    dispatch(
      addCertificate({
        id: crypto.randomUUID(),
        certificateName: data.cerificationName,
        issuerName: data.issuerName,
        file,
      })
    );
    reset();
    setScreen(3);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-center mb-6">
        <div className="flex gap-5 cursor-pointer text-lg font-semibold bg-purple-100 p-3 rounded-lg shadow-md">
          <span
            onClick={() => setScreen(1)}
            className={`px-6 py-2 rounded-md ${
              screen === 1 ? "bg-purple-500 text-white" : "text-gray-700"
            }`}
          >
            Form
          </span>
          <span
            onClick={() => setScreen(3)}
            className={`px-6 py-2 rounded-md ${
              screen === 3 ? "bg-purple-500 text-white" : "text-gray-700"
            }`}
          >
            Preview
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center">
        {screen === 1 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl w-full bg-white p-6 shadow-lg rounded-lg border border-purple-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomInput
                name="cerificationName"
                type="text"
                register={register}
                placeholder="Enter Certification Name"
                label="Certification Name"
                errors={errors}
              />
              <CustomInput
                name="issuerName"
                type="text"
                register={register}
                placeholder="Enter Issuer Name"
                label="Issuer Name"
                errors={errors}
              />
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-gray-700 mb-2">
                Upload File
              </label>

              <label className="relative block py-8 border border-purple-500 rounded-full bg-purple-100 p-4 cursor-pointer hover:bg-purple-200 transition">
                <input
                  type="file"
                  {...register("file")}
                  className="absolute hidden inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Centered Upload Button */}
                <p className="hidden absolute uppercase md:flex  justify-center items-center gap-2 py-1 bg-purple-500 top-1/2   -translate-x-1/2 -translate-y-1/2 px-3 right-0 rounded-full text-white font-semibold">
                  Upload <Upload size={20} />
                </p>
                <p className=" md:hidden absolute inset-0 rounded-full uppercase flex  justify-center items-center gap-2 py-1 bg-purple-500  text-white font-semibold">
                  Upload <Upload size={20} />
                </p>
              </label>

              {errors.file && (
                <p className="text-red-500 mt-1">{errors.file.message}</p>
              )}
              <p className="text-center text-gray-500 text-sm mt-2">
                File format should be only PDF or JPG.
              </p>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition"
            >
              Submit
            </button>
          </form>
        )}

        {screen === 3 && (
          <div className="max-w-4xl mb-10 w-full bg-white p-6 shadow-lg rounded-lg border border-purple-300">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
              Saved Certificates
            </h2>
            <div className="border rounded-lg overflow-hidden">
              {certificates.map((cert, index) => (
                <div
                  key={cert.id}
                  className={`px-6 py-4 transition duration-200 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-white bg-purple-500 px-2 py-1 rounded-full font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex gap-6 items-center">
                      <p className="text-xl font-semibold capitalize text-gray-800">
                        {cert.certificateName}
                      </p>
                      <p className="text-gray-600 font-medium">
                        {cert.issuerName}
                      </p>
                    </div>
                    <div
                      className="cursor-pointer bg-red-500 rounded-full p-1 px-2 text-white text-sm font-bold"
                      onClick={() => dispatch(removeCertificate(cert.id))}
                    >
                      x
                    </div>
                  </div>
                  {cert.file && (
                    <div className="flex justify-center">
                      <a
                        href={URL.createObjectURL(cert.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-semibold hover:underline hover:text-blue-800 transition"
                      >
                        <span className="underline"> View Certificate</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
