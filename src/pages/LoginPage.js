import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/LoginPage.css";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

const LoginPageSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

function Login(props) {
  const [serverError, setServerError] = useState("");
  const { isAuth, setAuth } = props;
  const Navigate = useNavigate();

  return (
    <main id="login-main">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={LoginPageSchema}
        onSubmit={(values) => {
          axios
            .post("http://localhost:9000/auth/login", values)
            .then((resp) => {
              const token = resp.data.token;

              localStorage.setItem("token", token);
              setAuth(true);
              Navigate("/recipes");
            })
            .catch((err) => {
              const errMessage = err.response.data.error;
              console.log(errMessage);
              setServerError(errMessage);
            });
        }}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <h2 className="form-h2">Login</h2>
            <label className="form-label">
              <div>
                <p className="form-p">Username:</p>
                {errors.username && touched.username ? (
                  <p className="error-val">{errors.username}</p>
                ) : null}
              </div>
              <Field className="form-input" name="username" />
            </label>
            <label className="form-label">
              <div>
                <p className="form-p">Password:</p>
                {errors.password && touched.password ? (
                  <p className="error-val">{errors.password}</p>
                ) : null}
              </div>
              <Field className="form-input" name="password" type="password" />
            </label>
            {serverError ? (
              <p className="error-val">Server Error: {serverError}</p>
            ) : null}
            <Link
              style={{ marginTop: "0.2rem" }}
              className="form-a"
              to="/resetpassword"
            >
              Forgot Password?
            </Link>
            <Link className="form-a" to="/register">
              Not a User?
            </Link>
            <button
              id="log-btn"
              className="form-button btn-global"
              type="submit"
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
}

export default Login;