//@ts-check
import React from "react";
import { TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";


const FormPassword = ({ onSubmit, loading }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            oldpassword: '',
            newpassword: "",
            repassword: ""
        },
        validate: {
            oldpassword: (value) => value ? null : 'Current Password cannot empty',
            newpassword: (value) => value ? null : 'New Password cannot empty',
            repassword: (value) => value ? null : 'Repeat New Password cannot empty'
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
                    type="password"
                    label="Current Password"
                    key={form.key('oldpassword')}
                    {...form.getInputProps('oldpassword')}
                />
                <TextInput
                    withAsterisk
                    type="password"
                    label="New Password"
                    key={form.key('newpassword')}
                    {...form.getInputProps('newpassword')}
                />
                <TextInput
                    withAsterisk
                    type="password"
                    label="Repeat New Password"
                    key={form.key('repassword')}
                    {...form.getInputProps('repassword')}
                />
                <div className="flex justify-end w-full">
                    <PrimaryButton
                        disabled={loading}
                        type="submit"
                    >Submit</PrimaryButton>
                </div>
            </form>
        </>
    )
}

export default FormPassword