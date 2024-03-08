import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { dashboardReducer } from './ngrx/dashboard/dashboard.reducer';
import { postManagementReducer } from './ngrx/post-management/post-management.reducer';
import { authReducer } from './ngrx/auth/auth.reducer';
import { AuthEffects } from './ngrx/auth/auth.effect';
import { roleReducer } from './ngrx/role/role.reducer';
import { RoleEffect } from './ngrx/role/role.effect';
import { postReducer } from './ngrx/post/post.reducer';
import { categoryReducer } from './ngrx/category/category.reducer';
import { PostEffects } from './ngrx/post/post.effects';
import { CategoryEffects } from './ngrx/category/category.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      role: roleReducer,
    }),
    provideState({ name: 'dashboard', reducer: dashboardReducer }),
    provideState({ name: 'postManagement', reducer: postManagementReducer }),
    provideEffects(),
    provideState({ name: 'auth', reducer: authReducer }),
    provideState({ name: 'role', reducer: roleReducer }),
    provideState({ name: 'post', reducer: postReducer }),
    provideState({ name: 'category', reducer: categoryReducer }),
    provideEffects([AuthEffects, RoleEffect, PostEffects, CategoryEffects]),
    provideHttpClient(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'itss-imago-0000',
          appId: '1:1098187958856:web:931b5d503852e1c9a1867d',
          storageBucket: 'itss-imago-0000.appspot.com',
          apiKey: 'AIzaSyAJ93BuFGs7gOJe9kudLYvAn4-Fp6Q936M',
          authDomain: 'itss-imago-0000.firebaseapp.com',
          messagingSenderId: '1098187958856',
          measurementId: 'G-7TVCQGP8RS',
        }),
      ),
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
