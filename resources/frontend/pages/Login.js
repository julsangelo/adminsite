import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./Login.module";
import Input from "../components/Input";
import Button from "../components/Button";
import { userLogin } from "../ajax/backend";
import { useFlashMessage } from "../context/FlashMessage";
import { LoginContext } from "../context/LoginProvider";
import Brand from "../components/Brand";

export default function Login() {
    const { setLoginToken } = useContext(LoginContext);
    const { setFlashMessage, setFlashStatus } = useFlashMessage();

    const validationSchema = Yup.object().shape({
        emailOrUserID: Yup.string().required("Email or User ID is required"),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data) => {
        userLogin(data, setFlashMessage, setFlashStatus, setLoginToken);
    };

    return (
        <div className={styles.login}>
            <form
                className={styles.loginContainer}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.brandContainer}>
                    <p className={styles.brandHeading}>CLIFF</p>
                    <p className={styles.brandSubheading}>
                        Automotive Parts Trading
                    </p>
                </div>
                <Input
                    label="Email or User ID"
                    name="emailOrUserID"
                    {...register("emailOrUserID")}
                    error={errors.emailOrUserID?.message}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <Button label="Login" type="submit" />
            </form>
        </div>
    );
}
