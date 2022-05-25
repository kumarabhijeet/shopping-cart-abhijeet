import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Grid } from "@material-ui/core";
import './ProductListingPage.css';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

const ProductListingPage = () => {
    const classes = useStyles();
    const [categoriesData, setCategoriesData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get(`http://localhost:3000/categories`)
            .then(res => {
                const categories = res.data;
                setCategoriesData(categories)
            })
        axios.get(`http://localhost:3000/products`)
            .then(res => {
                const products = res.data;
                setProductsData(products)
            })

    }, [])
    const handleSidebarCategory = (ev, text) => {
        if (text.id === categoryId) {
            setCategoryId('');
        }
        else {
            setCategoryId(text.id);
        }
    }
    const handleBuyNow = (ev, items) => {
        console.log("999=>", items);
        axios.post('http://localhost:3000/addToCart ', { productID: items.id })
            .then((response) => {
                if (response.statusText === "Created") {
                    dispatch({ type: 'PRODUCT_ADDED_IN_CART', payload: items })
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    console.log("categories==>", categoriesData, productsData, categoryId)
    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {categoriesData.map((text, index) => (
                        <ListItem button key={text.name} style={{background:text.id===categoryId?'rgba(0, 0, 0, 0.04)':'none'}}>
                            <ListItemText primary={text.name} onClick={(ev) => handleSidebarCategory(ev, text)} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container spacing={2}>


                    {
                        productsData.map((items) => {
                            if (items.category === categoryId) {
                                return (
                                    <React.Fragment>

                                        <Grid item xs={12} sm={6} md={3} style={{textAlign:'center'}}>
                                            <p className='headerText'>{items.name}</p>
                                            <img src={items.imageURL} width="160" />
                                            <p className='productDesc'>{items.description}</p>
                                            <div className='bottomText'>
                                                <div><span>MRP</span>&nbsp;<span>Rs</span>&nbsp;<span>{items.price}</span></div>
                                                <div>
                                                    <Button size="small" variant="contained" color="secondary" onClick={(ev) => handleBuyNow(ev, items)}>
                                                        Buy Now
                                                    </Button>
                                                </div>
                                            </div>

                                        </Grid>
                                    </React.Fragment>
                                )
                            }
                            else {
                                if (categoryId === "") {
                                    return (
                                        <React.Fragment>
                                            <Grid item xs={12} sm={6} md={3} style={{textAlign:'center'}}>
                                              
                                                <p className='headerText'>{items.name}</p>
                                                <img src={items.imageURL} width="160" className='plpImg' />
                                                <p className='productDesc'>{items.description}</p>
                                                <div className='bottomText'>
                                                    <div><span>MRP</span>&nbsp;<span>Rs</span>&nbsp;<span>{items.price}</span></div>
                                                    <div>
                                                        <Button size="small" variant="contained" color="secondary" onClick={(ev) => handleBuyNow(ev, items)}>
                                                            Buy now
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Grid>

                                        </React.Fragment>
                                    )
                                }
                            }
                        })
                    }
                </Grid>

            </main>
        </div>
    );
}
export default ProductListingPage;