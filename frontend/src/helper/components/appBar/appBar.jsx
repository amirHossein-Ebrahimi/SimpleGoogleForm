import React from 'react'
import PropTypes from 'prop-types'
// third-party-packages
import { withStyles } from '@material-ui/core/styles'
// assets
import image from '../../../assets/images/brand.png'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    cursor: 'pointer',
    minWidth: 70,
  },
  input: {
    display: 'none',
  },
})

/* App bar */
const AppBar = ({
  classes,
  onLeftClick,
  onRightClick,
  rightText,
  leftText,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '100%',
        position: 'fixed',
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        height: 55,
        zIndex: 2,
      }}
    >
      <span
        className={classes.button}
        style={{ cursor: !leftText ? 'inherit' : 'pointer' }}
        onClick={onLeftClick}
      >
        {leftText}
      </span>
      <img
        src={image}
        alt="brand"
        style={{
          width: 150,
          height: 50,
          borderRadius: 37,
          background: 'white',
          padding: 15,
        }}
      />
      <span
        className={classes.button}
        style={{ cursor: !rightText ? 'inherit' : 'pointer' }}
        onClick={onRightClick}
      >
        {rightText}
      </span>
    </div>
  )
}

AppBar.propTypes = {
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
  rightText: PropTypes.node,
  leftText: PropTypes.node,
}
AppBar.defaultProps = {
  onLeftClick: Function.prototype,
  onRightClick: Function.prototype,
  rightText: '',
  leftText: '',
}

export default withStyles(styles)(AppBar)
