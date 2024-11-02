import React, {Fragment} from 'react';
import {
  useCategories,
  UseCategoriesResponse,
} from '@helpdesk/help-center/categories/requests/use-categories';
import {Trans} from '@ui/i18n/trans';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {Category, Section} from '@helpdesk/help-center/categories/category';
import {BulletSeparatedItems} from '@common/ui/other/bullet-seprated-items';
import {Button} from '@ui/buttons/button';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {HcManagerLayout} from '@helpdesk/help-center/manager/hc-manager-layout';
import {HcManagerBreadcrumb} from '@helpdesk/help-center/manager/hc-manager-breadcrumb';
import {HcManagerTitle} from '@helpdesk/help-center/manager/hc-manager-title';
import {HcManagerRow} from '@helpdesk/help-center/manager/hc-manager-row';
import {getCategoryLink} from '@helpdesk/help-center/categories/category-link';
import {HcManagerEmptyMessage} from '@helpdesk/help-center/manager/hc-manager-empty-message';
import {closeDialog, openDialog} from '@ui/overlays/store/dialog-store';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {useHcCategoryManagerParams} from '@helpdesk/help-center/categories/requests/use-hc-category-manager-params';
import {CreateCategoryDialog} from '@helpdesk/help-center/categories/crupdate-category-dialog/create-category-dialog';
import {useDeleteCategory} from '@helpdesk/help-center/categories/requests/use-delete-category';
import {useReorderCategories} from '@helpdesk/help-center/categories/requests/use-reorder-categories';
import {UpdateCategoryDialog} from '@helpdesk/help-center/categories/crupdate-category-dialog/update-category-dialog';

export function HcCategoryManager() {
  const params = useHcCategoryManagerParams();
  const query = useCategories(params);
  return (
    <HcManagerLayout
      query={query}
      actionButton={
        <DialogTrigger type="modal">
          <Button variant="flat" color="primary" className="max-md:mt-12">
            {params.type === 'category' ? (
              <Trans message="New category" />
            ) : (
              <Trans message="New section" />
            )}
          </Button>
          <CreateCategoryDialog parentId={params.parentId} />
        </DialogTrigger>
      }
    >
      {data => <PageContent data={data} />}
    </HcManagerLayout>
  );
}

interface PageContentProps {
  data: UseCategoriesResponse;
}
function PageContent({data}: PageContentProps) {
  const params = useHcCategoryManagerParams();
  const categories = data.pagination.data;
  const count = categories.length;
  return (
    <Fragment>
      <HcManagerBreadcrumb category={data.category} />
      {count ? (
        <HcManagerTitle>
          {params.type === 'category' ? (
            <Trans message="Categories (:count)" values={{count}} />
          ) : (
            <Trans message="Sections (:count)" values={{count}} />
          )}
        </HcManagerTitle>
      ) : null}
      {categories.map(category => (
        <CategoryRow category={category} data={data} key={category.id} />
      ))}
      {!categories.length && <NoResultsMessage />}
    </Fragment>
  );
}

interface CategoryRowProps {
  category: Category | Section;
  data: UseCategoriesResponse;
}
function CategoryRow({
  category,
  data: {
    pagination: {data: categories},
    category: parent,
  },
}: CategoryRowProps) {
  const navigate = useNavigate();
  const deleteCategory = useDeleteCategory();
  const reorder = useReorderCategories();

  const goToEditPage = () => {
    if (category.is_section) {
      navigate(`../hc/arrange/sections/${category.id}`);
    } else {
      navigate(`../hc/arrange/categories/${category.id}`);
    }
  };

  return (
    <HcManagerRow
      item={category}
      items={categories}
      onSortEnd={(oldIndex, newIndex) => {
        reorder.mutate({oldIndex, newIndex, parentId: parent?.id});
      }}
      onClick={() => goToEditPage()}
      onView={() => navigate(getCategoryLink(category))}
      onEdit={() => openDialog(UpdateCategoryDialog, {category})}
      onDelete={() => {
        openDialog(ConfirmationDialog, {
          title: <Trans message="Delete category" />,
          body: (
            <Trans message="Are you sure you want to delete this category?" />
          ),
          confirm: <Trans message="Delete" />,
          isDanger: true,
          isLoading: deleteCategory.isPending,
          onConfirm: () =>
            deleteCategory.mutate(
              {id: category.id},
              {onSuccess: () => closeDialog()},
            ),
        });
      }}
      description={
        <BulletSeparatedItems>
          {category.sections_count ? (
            <Trans
              message="[one 1 section|other :count sections]"
              values={{count: category.sections_count}}
            />
          ) : null}
          <Trans
            message="[one 1 article|other :count articles]"
            values={{count: category.articles_count}}
          />
        </BulletSeparatedItems>
      }
    >
      {category.name}
    </HcManagerRow>
  );
}

function NoResultsMessage() {
  const {parentId} = useHcCategoryManagerParams();
  if (parentId) {
    return (
      <HcManagerEmptyMessage
        title={<Trans message="This category is empty" />}
        description={
          <Trans message="Empty categories aren't visible in the Help Center. You can make them visible by adding a section." />
        }
      />
    );
  }
  return (
    <HcManagerEmptyMessage
      title={<Trans message="There are no categories yet" />}
    />
  );
}
