//@ts-check
import React from "react";
import { TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";


const FormLogin = ({ onSubmit }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: ""
        },
    });

    return (
        <>
            <form
                className="w-full space-y-2"
                onSubmit={form.onSubmit(onSubmit)}
            >
                <TextInput
                    withAsterisk
                    label="Username"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />
                <TextInput
                    type="password"
                    label="Password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />
                <div className="flex justify-end w-full">
                    <PrimaryButton
                        type="submit"
                    >Submit</PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default FormLogin