const GITHUB_CLIENT_ID = "e828a5838b33f9474bdd";
const gitHubRedirectURL = "http://localhost:8081/github-actions/auth";
const path = "/";

export const LoginPage = () => {
    return (
        <div className="App">
                <a
                    href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${gitHubRedirectURL}?path=${path}&scope=user:email`}
                >
                    LOGIN WITH GITHUB
                </a>
        </div>
    );
}