import React from "react";
// import { categoryList, ratingList } from '../../../constants';
// import CheckboxProton from '../../common/CheckboxProton';
// import FilterListToggle from '../../common/FilterListToggle';
// import SliderProton from '../../common/SliderProton';
import classes from "./styles.module.scss";
import CheckboxProton from "components/CheckboxProton";
import SliderProton from "components/SliderProton";
import FilterListToggle from "components/FilterListToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { ratingList } from "configs/constants";
import BoxSmallLeft from "components/BoxSmallLeft";
import clsx from "clsx";
interface Props {
  selectedCategory?: any;
  selectCategory?: any;
  selectedRating?: any;
  selectedPrice?: any;
  selectRating?: any;
  tags?: any;
  changeChecked?: any;
  changePrice?: any;
}
const FilterPanel = ({
  selectedCategory,
  selectCategory,
  selectedRating,
  selectedPrice,
  selectRating,
  tags,
  changeChecked,
  changePrice,
}: Props) => (
  <div>
    <div className={classes.inputGroup}>
      {/* <FilterListToggle
        options={categoryList}
        value={selectedCategory}
        selectToggle={selectCategory}
      /> */}
    </div>
    {changePrice && (
      <BoxSmallLeft title="Price Range">
        <div>
          <div className={classes.titlePrice}></div>
          <SliderProton value={selectedPrice} changePrice={changePrice} />
        </div>
      </BoxSmallLeft>
    )}
    <BoxSmallLeft title="Options" className={classes.inputGroup}>
      <div>
        {tags?.map((tag) => (
          <CheckboxProton
            key={tag.id}
            tags={tag}
            changeChecked={changeChecked}
          />
        ))}
      </div>
    </BoxSmallLeft>

    <BoxSmallLeft title="Star Rating">
      <div>
        <FilterListToggle
          options={ratingList}
          value={selectedRating}
          selectToggle={selectRating}
        />
      </div>
    </BoxSmallLeft>
  </div>
);

export default FilterPanel;
