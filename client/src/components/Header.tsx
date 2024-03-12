import { Link } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from './Button'
import { useAuth } from '../state';

const Header = () => {
	const { isLoggedIn, logout } = useAuth();

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
					<Link to="/create-post">

						<PrimaryButton>Create Post</PrimaryButton>
					</Link>
				</div>
				<div className="flex gap-2">
					{isLoggedIn() ? <PrimaryButton onClick={onLogout}>Logout</PrimaryButton> : <>
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