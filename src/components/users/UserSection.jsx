import React, {Component} from 'react';
import PropTypes from 'prop-types'
import UserForm from './UserForm.jsx';
import UserList from './UserList.jsx';


class UserSection extends Component {
    render() {
        return (
            <div className='support card bg-info border-0'>
                <div className='card-header'>
                    <strong>Users</strong>
                </div>
                <div className='card-body users'>
                    <UserList {...this.props} />
                    <UserForm {...this.props} />
                </div>
            </div>

        )
    }
}

UserSection.propTypes = {
    users: PropTypes.array.isRequired,
    setUserName: PropTypes.func.isRequired,
};

export default UserSection