//@ts-check
import React from "react";
import { MultiSelect, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { MANAGE_ACCOUNT_ROLES, MANAGE_PROJECT_ROLES } from "@/global/utils/constant";
import SelectProject from "../../selects/SelectProjects";
import { AppContext } from "@/client/context";


const FormAccount = ({ initialValue = null, loading, onSubmit }) => {
    const { account: me } = React.useContext(AppContext)

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: initialValue?.username || "",
            roles: initialValue?.roles || [],
            projects: initialValue?.projects || []
        },
        validate: {
            username: (value) => value ? null : 'Username cannot empty'
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
                    label="Username"
                    key={form.key('username')}
                    disabled={initialValue !== null}
                    {...form.getInputProps('username')}
                />
                <MultiSelect
                    label="Select roles"
                    placeholder="Select Roles"
                    data={[MANAGE_ACCOUNT_ROLES, MANAGE_PROJECT_ROLES]}
                    {...form.getInputProps('roles')}
                />
                {me?.roles?.includes(MANAGE_PROJECT_ROLES) &&
                    <SelectProject
                        label="Select Projects"
                        placeholder="Select Projects"
                        {...form.getInputProps('projects')}
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

export default FormAccount