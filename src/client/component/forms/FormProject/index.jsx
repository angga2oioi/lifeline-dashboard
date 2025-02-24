//@ts-check
import React from "react";
import { TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";
import SelectAccounts from "../../selects/SelectAccounts";
import { AppContext } from "@/client/context";
import { MANAGE_ACCOUNT_ROLES } from "@/global/utils/constant";


const FormProject = ({ initialValue = null, loading, onSubmit }) => {
    const { account: me } = React.useContext(AppContext)

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: initialValue?.name || "",
            accounts: initialValue?.accounts?.map((n) => { return n?.id }) || [],
        },
        validate: {
            name: (value) => value ? null : 'Project Name cannot empty'
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
                    label="Project Name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                {
                    me?.roles?.includes(MANAGE_ACCOUNT_ROLES) &&
                    <SelectAccounts
                        label="Select Accounts"
                        placeholder="Select Accounts"
                        {...form.getInputProps('accounts')}
                    />
                }

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

export default FormProject