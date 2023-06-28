import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import className from "./styles.module.scss";
import clsx from "clsx";
import Stars from "components/Stars";
const useStyles = makeStyles({
  root: {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
  },
  toggle: {
    fontFamily: `'Raleway', sans-serif`,
    fontSize: '.8rem',
    borderRadius: '10px',
    border: '1px solid transparent',
    '&.MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
      borderRadius: '10px',
    },
    '&.MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
      borderRadius: '10px',
    },
    '&.Mui-selected': {
      borderRadius: '10px',
      background: 'var(--gray-90)',
      color: '#fff',
    },
    '&.MuiToggleButton-root': {
      '&:hover': {
        color: '#fff',
      },
    },
    '&.MuiToggleButton-root': {
        justifyContent: 'flex-start',
      },
  },
});

const FilterListToggle = ({ options, value, selectToggle }) => {
  const classes = useStyles();
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={selectToggle}
      className={clsx(className.button,classes.root)}
    >
      {options.map(({ label, id, value }) => (
        <ToggleButton className={classes.toggle} key={id} value={value}>
          <Stars numberOfStars={label}/>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FilterListToggle;
