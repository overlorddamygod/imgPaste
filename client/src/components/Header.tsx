import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from './Button'
import { useAuth } from '../state';

const Header = () => {
	const { user, isLoggedIn, logout } = useAuth();
	const navigate = useNavigate();

	const onLogout = () => {
		logout()
	}

	return (
		<header className="py-3">
			<nav className="spacing flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Link to="/">
						<h1 className="font-extrabold text-4xl inline-block">imgPaste</h1>
					</Link>
					<PrimaryButton onClick={() => {
						if (!isLoggedIn()) {
							navigate('/login?message=You need to login to create a post');
						} else {
							navigate('/create-post');
						}
					}}>Create Post</PrimaryButton>
				</div>
				<div className="flex gap-2">
					{isLoggedIn() ? <div>Hi, {user!.username}<PrimaryButton onClick={onLogout} className="ml-2">Logout</PrimaryButton></div> : <>
						<Link to="/login"><PrimaryButton>Login</PrimaryButton></Link>
						<Link to="/register">
							<SecondaryButton>Register</SecondaryButton>
						</Link>
					</>}
				</div>
			</nav>
		</header>
	)
}

export default Header