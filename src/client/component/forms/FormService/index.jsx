//@ts-check
import React from "react";
import { TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";


const FormService = ({ initialValue = null, loading, onSubmit }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: initialValue?.name || "",
        },
        validate: {
            name: (value) => value ? null : 'Service Name cannot empty'
        }
    });

    return (
        <>
            <form
                className="w-full space-y-2"
                onSubmit={form.onSubmit(onSubmit)}
            >
                <TextInput
                    withAsterisk
                    label="Service Name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <div className="flex justify-end w-full">
                    <PrimaryButton
                        type="submit"
                        disabled={loading}
                    >Submit</PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default FormService